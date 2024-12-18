import { model, Model, Schema } from "mongoose";
import { CommentLike } from "../types/comment-like";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { SchemaNames } from "../types/schema-names.enum";
import { userInteractionSchemaDef } from "../schema-defs/user-interaction.schema-def";

const schema = new Schema<CommentLike, Model<CommentLike>>({
    ...userInteractionSchemaDef,
    commentId: idSchemaDef
});

schema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = model<CommentLike, Model<CommentLike>>(SchemaNames.COMMENT_LIKE, schema);