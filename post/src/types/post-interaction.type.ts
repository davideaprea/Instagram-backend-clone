import { ObjectId } from "mongoose";
import { UserInteraction } from "./user-interaction.type";

export type PostInteraction = UserInteraction & {
    postId: ObjectId
}