import { Document, Query, Types, Model } from "mongoose";
import { IUser } from "../models/userModel";
export type mongoId = Types.ObjectId;

export type userDocument = IUser & Document;
