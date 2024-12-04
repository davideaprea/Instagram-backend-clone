import { idSchema } from "@ig-clone/common";
import Joi from "joi";
import { InteractiveContent } from "../src/types/interactive-content.type";

export const interactveContentSchema = Joi.object<InteractiveContent>({
    text: Joi
        .string()
        .max(500)
        .message("Caption text must not exceed 500 characters."),
    tags: Joi
        .array()
        .items(idSchema)
        .max(30)
        .message("Caption tags must not exceed 30 items."),
    hashtags: Joi
        .array()
        .items(Joi.string())
        .max(30)
        .message("Caption hashtags must not exceed 30 items.")
});