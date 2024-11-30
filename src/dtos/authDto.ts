import { IUser } from "../models/userModel";

export interface signUpBody
  extends Pick<IUser, "name" | "email" | "password"> {}

export interface logInBody extends Pick<IUser, "email" | "password"> {}
