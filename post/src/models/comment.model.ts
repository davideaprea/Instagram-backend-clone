import { model, Model, Schema } from "mongoose";
import { Comment } from "../types/comment.type";
import { interactiveContentSchemaDef } from "../schema-defs/interactive-content.schema-def";
import { counterSchemaDef } from "../schema-defs/counter.schema-def";
import { postInteractionSchemaDef } from "../schema-defs/post-interaction-schema-def";
import { SchemaNames } from "../types/schema-names.enum";

const commentSchema = new Schema<Comment, Model<Comment>>({
    ...postInteractionSchemaDef,
    likes: counterSchemaDef,
    content: interactiveContentSchemaDef,
    replies: counterSchemaDef,
    pinned: {
        type: Boolean,
        defaul: false
    }
});

commentSchema.index({ postId: 1, pinned: -1, _id: -1 });

export const CommentModel = model<Comment, Model<Comment>>(SchemaNames.COMMENT, commentSchema);