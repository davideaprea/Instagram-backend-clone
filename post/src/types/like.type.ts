import { ObjectId } from "mongoose";
import { UserInteraction } from "./user-interaction.type";

export type Like = UserInteraction & {
    resourceId: ObjectId;
}