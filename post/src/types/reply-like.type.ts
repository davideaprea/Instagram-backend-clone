import { ObjectId } from "mongoose";
import { UserInteraction } from "./user-interaction.type";

export type ReplyLike = UserInteraction & {
    replyId: ObjectId
}