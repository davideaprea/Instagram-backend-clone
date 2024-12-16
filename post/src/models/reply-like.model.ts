import { model, Model, Schema } from "mongoose";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { timeSchemaDef } from "../schema-defs/time-schema-def";
import { SchemaNames } from "../types/schema-names.enum";
import { ReplyLike } from "../types/reply-like.type";

const schema = new Schema<ReplyLike, Model<ReplyLike>>({
    userId: idSchemaDef,
    replyId: idSchemaDef,
    time: timeSchemaDef
});

schema.index({ replyId: 1, userId: 1 }, { unique: true });

export const ReplyLikeModel = model<ReplyLike, Model<ReplyLike>>(SchemaNames.REPLY_LIKE, schema);