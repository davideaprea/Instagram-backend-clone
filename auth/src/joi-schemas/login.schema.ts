import Joi from "joi";
import { User } from "../types/user.type";

export const loginSchema = Joi.object<Pick<User, "email" | "password">>({
    email: Joi.string().email().required().trim().message("Invalid email."),
    password: Joi.string().required().trim().message("Password is required.")
});