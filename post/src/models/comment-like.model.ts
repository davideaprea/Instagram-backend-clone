import { model, Model, Schema } from "mongoose";
import { CommentLike } from "../types/comment-like";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { timeSchemaDef } from "../schema-defs/time-schema-def";
import { SchemaNames } from "../types/schema-names.enum";

const schema = new Schema<CommentLike, Model<CommentLike>>({
    userId: idSchemaDef,
    commentId: idSchemaDef,
    time: timeSchemaDef
});

schema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = model<CommentLike, Model<CommentLike>>(SchemaNames.COMMENT_LIKE, schema);