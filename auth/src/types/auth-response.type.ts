import { Types } from "mongoose";
import { User } from "./user.type";
import { UserDocument } from "./user-document.type";

export type AuthResponse = Pick<UserDocument, "username" | "fullName" | "id">;