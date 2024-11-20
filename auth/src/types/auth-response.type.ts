import { User } from "./user.type";

export type AuthResponse = Pick<User, "username" | "fullName"> & {
    id: string
};