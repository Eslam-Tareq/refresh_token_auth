import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "express-async-handler";
import {
  createAccessToken,
  createRefreshToken,
  verifyTokenAsync,
} from "../utils/jwt";
import { userDocument } from "../types/documentTypes";
import { hashingPassword, isCorrectPassword } from "../utils/password";
import { PublicObject } from "../types/types";
import { logInBody, signUpBody } from "../dtos/authDto";

export const signUpService = async (
  req: Request<{}, {}, signUpBody>
): Promise<userDocument> => {
  const { name, email, password } = req.body;
  // hashing password before saving it in data base
  const hashedPassword = await hashingPassword(password);
  //1- create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return newUser;
};

export const logInService = async (
  req: Request<{}, {}, logInBody>,
  res: Response,
  email: string,
  password: string
) => {
  //console.log(typeof req.query.limit, typeof req.query.page);
  //1- find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("email or password is incorrect", 400);
  }
  if (!user.password) {
    throw new AppError("email or password is incorrect", 400);
  }
  //2- checking password correction
  const isPassCorrect = await isCorrectPassword(password, user.password);
  if (!isPassCorrect) {
    throw new AppError("email or password is incorrect", 400);
  }

  //login success
  const [accessToken, refreshToken, updatedUser] =
    await createTokensForLoggedInUser(user, req, res);

  return [true, accessToken, refreshToken, updatedUser];
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user: any;
    try {
      const [refreshTokenDecodedEmail, foundedUser] = await refreshTokenHandler(
        req
      );
      let token: string;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[0];
      } else {
        token = req.cookies.accessToken;
      }
      if (!token) {
        throw new AppError("there is no access token", 401);
      }
      user = foundedUser;
      const decoded = (await verifyTokenAsync(token, "access")) as JwtPayload;
      user = await User.findById(decoded!.userId);
      if (!user) {
        throw new AppError("user belong to that token does not exist", 401);
      }
      if (user.email !== refreshTokenDecodedEmail) {
        throw new AppError(
          "malicious user try to access with refresh token and access token not belong to the same user",
          403
        );
      }
      // imagine we have a change current password endpoint
      if (user.passwordChangedAt) {
        const passChangedAtTimeStamp = parseInt(
          `${user.passwordChangedAt.getTime() / 1000}`,
          10
        );

        if (passChangedAtTimeStamp > decoded!.iat!) {
          throw new AppError("password is changed please login again", 401);
        }
      }

      (req as PublicObject).user = user; // for letting user to use protected routes
      next();
    } catch (err) {
      if ((err as Error).message === "jwt expired") {
        // from access expiration
        // token rotation
        const accessToken = createAccessToken(user?.id);
        const refreshToken = createRefreshToken(user?.email);
        const newRefreshTokens = user.refreshTokens;
        const refreshTokenList: any[] = [];
        for (const rt of newRefreshTokens) {
          if (rt !== req.cookies.refreshToken) refreshTokenList.push(rt);
        }
        user.refreshTokens = [...refreshTokenList, refreshToken as string];
        await user.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 10 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 10 * 24 * 60 * 60 * 1000,
        });
        (req as PublicObject).user = user;
        next();
      } else {
        let customError = new AppError( //any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
          "you are not logged in, please login to access this route",
          401
        );
        customError.stack = (err as Error).stack; //to know from where the error is occurred
        return next(customError);
      }
    }
  }
);
const refreshTokenHandler = async (req: Request) => {
  try {
    let refreshToken: string;
    if (req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    } else {
      throw new AppError("there is no refresh token", 403);
    }
    const foundUser = await User.findOne({ refreshTokens: refreshToken });

    // detect reuse of refreshToken
    if (!foundUser) {
      const decoded = await verifyTokenAsync(refreshToken, "refresh");
      const hackedUser = await User.findOne({
        email: (decoded as JwtPayload).email,
      });
      if (hackedUser) {
        //signout all users
        hackedUser.refreshTokens = [];
        await hackedUser.save();
      }
      throw new AppError("reuse detection", 403);
    }

    const decoded = await verifyTokenAsync(refreshToken, "refresh");
    return [(decoded as JwtPayload).email, foundUser];
  } catch (err) {
    if ((err as Error).message === "jwt expired") {
      throw new AppError("Expired refresh token", 403);
    } else if ((err as Error).message === "invalid signature") {
      throw new AppError("Invalid refresh token", 403);
    } else throw err;
  }
};

const createTokensForLoggedInUser = async (
  user: userDocument,
  req: Request,
  res: Response
) => {
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.email);
  //try to login and he already logged in
  const cookies = req.cookies;
  let newRefreshTokens = !cookies?.refreshToken
    ? user.refreshTokens
    : user.refreshTokens.filter((rt) => rt !== cookies.refreshToken);

  user.refreshTokens = [...newRefreshTokens, refreshToken as string];

  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  user.refreshTokens = [];
  return [accessToken, refreshToken, user];
};
