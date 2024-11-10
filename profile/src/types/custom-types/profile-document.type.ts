import { Profile } from "@ig-clone/common";
import { Document, Types } from "mongoose";

export type ProfileDocument = Profile & Document<Types.ObjectId>;