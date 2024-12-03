import { ObjectId } from "mongoose";
import { InteractiveContent } from "./interactive-content.type";

export type Post = {
    userId: ObjectId
    medias: string[]
    comments: number
    likes: number
    allowComments: boolean
    pinned: boolean
    caption: InteractiveContent
    tags: ObjectId[]
    time: number
};