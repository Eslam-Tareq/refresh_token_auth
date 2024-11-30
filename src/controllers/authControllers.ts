import { Request, Response, NextFunction } from "express";

import catchAsync from "express-async-handler";
import User from "../models/userModel";
import { logInService, signUpService } from "../services/authServices";
import { logInBody } from "../dtos/authDto";
import { PublicObject } from "../types/types";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await signUpService(req);

      res.status(201).json({
        success: true,
        message: "User created successfully, please login again",
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const logIn = catchAsync(
  async (
    req: Request<{}, {}, logInBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [isActivated, token, refreshToken, user] = await logInService(
        req,
        res,
        req.body.email,
        req.body.password
      );
      if (isActivated) {
        res.status(200).json({
          success: true,
          user,
          accessToken: token,
          refreshToken,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "activation code sent, please check your mail box",
          activationToken: token,
        });
      }
    } catch (err) {
      return next(err);
    }
  }
);

export const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const user = await User.findById((req as PublicObject).user?.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt !== refreshToken
      );
      await user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  }
);

export const getMe = catchAsync(
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        user: (req as PublicObject).user,
      });
    } catch (err) {
      return next(err);
    }
  }
);
