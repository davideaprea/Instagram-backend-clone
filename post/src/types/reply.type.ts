import { ObjectId } from "mongoose";
import { UserInteraction } from "./user-interaction.type";
import { InteractiveContent } from "./interactive-content.type";
import { Likeable } from "./likeable.type";

export type Reply = Likeable & UserInteraction & {
    commentId: ObjectId
    content: InteractiveContent
}