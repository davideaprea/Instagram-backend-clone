import { model, Model, Schema } from "mongoose";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { SchemaNames } from "../types/schema-names.enum";
import { ReplyLike } from "../types/reply-like.type";
import { userInteractionSchemaDef } from "../schema-defs/user-interaction.schema-def";

const schema = new Schema<ReplyLike, Model<ReplyLike>>({
    ...userInteractionSchemaDef,
    replyId: idSchemaDef
});

schema.index({ replyId: 1, userId: 1 }, { unique: true });

export const ReplyLikeModel = model<ReplyLike, Model<ReplyLike>>(SchemaNames.REPLY_LIKE, schema);