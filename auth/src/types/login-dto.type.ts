import { User } from "./user.type";

export type LoginDto = Pick<User, "email" | "password">;