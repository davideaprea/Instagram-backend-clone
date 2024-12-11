import { model, Model, Schema, Types } from "mongoose";
import { Post } from "../types/post.type";
import { SchemaNames } from "../types/schema-names.enum";
import { interactiveContentSchemaDef } from "../schema-defs/interactive-content.schema-def";
import { counterSchemaDef } from "../schema-defs/counter.schema-def";
import { userInteractionSchemaDef } from "../schema-defs/user-interaction.schema-def";

const postSchema = new Schema<Post, Model<Post>>({
    ...userInteractionSchemaDef,
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: counterSchemaDef,
    likes: counterSchemaDef,
    caption: interactiveContentSchemaDef,
    medias: Array<String>,
    pinned: {
        type: Boolean,
        default: false
    },
    tags: Array<Types.ObjectId>
});

postSchema.index({ userId: 1, pinned: -1, _id: -1, });

export const PostModel = model<Post, Model<Post>>(SchemaNames.POST, postSchema);