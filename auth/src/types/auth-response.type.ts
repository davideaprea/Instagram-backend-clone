import { Types } from "mongoose";
import { User } from "./user.type";

export type AuthResponse = Pick<User, "username" | "fullName"> & {
    readonly id: Types.ObjectId
};