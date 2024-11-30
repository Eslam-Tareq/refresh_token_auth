import jwt, { JwtPayload } from "jsonwebtoken";
import { mongoId } from "../types/documentTypes";

export const createAccessToken = (payload: mongoId) => {
  return jwt.sign({ userId: payload }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const createRefreshToken = (payload: string) => {
  return jwt.sign({ email: payload }, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!,
  });
};

export const verifyTokenAsync = async (
  token: string,
  tokenType: "access" | "refresh"
) => {
  const secret =
    tokenType == "access"
      ? process.env.JWT_ACCESS_TOKEN_SECRET!
      : process.env.JWT_REFRESH_TOKEN_SECRET!;
  return await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
