import { model, Model, Schema } from "mongoose";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { timeSchemaDef } from "../schema-defs/time-schema-def";
import { SchemaNames } from "../types/schema-names.enum";

const schema = new Schema<PostLike, Model<PostLike>>({
    userId: idSchemaDef,
    postId: idSchemaDef,
    time: timeSchemaDef
});

schema.index({ postId: 1, userId: 1 }, { unique: true });

export const ReplyLikeModel = model<PostLike, Model<PostLike>>(SchemaNames.POST_LIKE, schema);