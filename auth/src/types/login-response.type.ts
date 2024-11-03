import { User } from "./user.type";

export type LoginResponse = Pick<User, "username" | "fullName"> & {
    jwt: string
};