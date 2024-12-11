import Joi from "joi";
import { ReplyDto } from "../types/reply-dto.type";
import { interactiveContentSchema } from "./interactive-content.schema";
import { idSchema } from "@ig-clone/common";

export const createReplySchema = Joi.object<ReplyDto>({
    content: interactiveContentSchema.fork(["text"], schema => schema.required()),
    commentId: idSchema.required()
});