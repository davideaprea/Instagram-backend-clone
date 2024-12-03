import { model, Model, Schema, Types } from "mongoose";
import { Post } from "../types/post.type";
import { SchemaNames } from "../types/schema-names.enum";

const postSchema = new Schema<Post, Model<Post>>({
    userId: {
        type: Types.ObjectId,
        required: true,
        immutable: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    caption: {
        text: String,
        tags: Array<Types.ObjectId>,
        hashtags: Array<String>
    },
    medias: Array<String>,
    pinned: {
        type: Boolean,
        default: false
    },
    tags: Array<Types.ObjectId>,
    time: {
        type: Number,
        immutable: true,
        required: true,
        default: Date.now()
    }
});

postSchema.index({ userId: 1, pinned: -1, _id: -1, });

export const PostModel = model<Post, Model<Post>>(SchemaNames.POST, postSchema);