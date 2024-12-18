import { model, Model, Schema } from "mongoose";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { SchemaNames } from "../types/schema-names.enum";
import { userInteractionSchemaDef } from "../schema-defs/user-interaction.schema-def";
import { Like } from "../types/like.type";

const schema = new Schema<Like, Model<Like>>({
    ...userInteractionSchemaDef,
    resourceId: idSchemaDef
});

schema.index({ resourceId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = model<Like, Model<Like>>(SchemaNames.COMMENT_LIKE, schema);
export const ReplyLikeModel = model<Like, Model<Like>>(SchemaNames.REPLY_LIKE, schema);
export const PostLikeModel = model<Like, Model<Like>>(SchemaNames.POST_LIKE, schema);