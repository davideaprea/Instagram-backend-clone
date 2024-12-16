import { ObjectId } from "mongoose";
import { UserInteraction } from "./user-interaction.type";

export type CommentLike = UserInteraction & {
    commentId: ObjectId
}