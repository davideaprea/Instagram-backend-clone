import Joi from "joi";
import { User } from "../types/user.type";

export const loginSchema = Joi.object<Pick<User, "email" | "password">>({
    email: Joi.string().email().message("Invalid email.").required().trim(),
    password: Joi.string().message("Password is required.").required().trim()
});