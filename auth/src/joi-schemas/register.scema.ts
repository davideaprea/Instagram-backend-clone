import Joi from "joi";
import { User } from "../types/user.type";
import { NAME_REGEX, USERNAME_REGEX } from "@ig-clone/common";
import { EMAIL_REGEX, PSW_REGEX } from "../constants/regexes";

const getValidator = (regex: RegExp, regexMsg: string) => {
    return Joi
        .string()
        .pattern(regex)
        .required()
        .trim()
        .messages({
            "string.empty": "Mandatory field.",
            "string.pattern.base": regexMsg
        });
}

export const registerSchema = Joi.object<User>({
    username: getValidator(USERNAME_REGEX, "Invalid username."),
    fullName: getValidator(NAME_REGEX, "Invalid name."),
    email: getValidator(EMAIL_REGEX, "Invalid email."),
    password: getValidator(PSW_REGEX, "Invalid password.")
});