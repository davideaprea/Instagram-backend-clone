import { Model } from "mongoose";
import { User } from "./user.type";

export type UserMongoModel = Model<User>;