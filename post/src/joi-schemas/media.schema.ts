import Joi from "joi";

export const mediaSchema = Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string().required(),
    mimetype: Joi
        .string()
        .valid("image/jpeg", "image/png")
        .required()
        .messages({
            "any.only": "File type must be either jpeg or png."
        }),
    size: Joi
        .number()
        .max(5 * 1024 * 1024)
        .required()
        .messages({
            "number.max": "File size must not exceed 5 MB."
        }),
    encoding: Joi.string(),
    buffer: Joi.binary()
});