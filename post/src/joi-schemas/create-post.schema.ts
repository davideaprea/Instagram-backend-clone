import Joi from "joi";
import { idSchema } from "@ig-clone/common";
import { mediaSchema } from "./media.schema";
import { interactveContentSchema } from "./interactive-content.schema";
import { PostDto } from "../types/post-dto.type";

export const createPostSchema = Joi.object<PostDto>({
    allowComments: Joi.boolean(),
    caption: interactveContentSchema,
    pinned: Joi.boolean(),
    tags: Joi.array().items(idSchema).max(30),
    medias: Joi.array().items(mediaSchema).max(20).min(1).required()
});