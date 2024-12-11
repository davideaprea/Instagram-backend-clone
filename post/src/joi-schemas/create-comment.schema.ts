import Joi from "joi";
import { CommentDto } from "../types/comment-dto.type";
import { interactiveContentSchema } from "./interactive-content.schema";
import { idSchema } from "@ig-clone/common";

export const createCommentSchema = Joi.object<CommentDto>({
    content: interactiveContentSchema.fork(["text"], schema => schema.required()),
    postId: idSchema.required()
});