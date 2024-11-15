import Joi from "joi";

export const idSchema = Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .message("The given ID is not valid.");