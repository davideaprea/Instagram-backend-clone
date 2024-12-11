import { model, Model, Schema } from "mongoose";
import { Reply } from "../types/reply.type";
import { userInteractionSchemaDef } from "../schema-defs/user-interaction.schema-def";
import { counterSchemaDef } from "../schema-defs/counter.schema-def";
import { idSchemaDef } from "../schema-defs/id.schema-def";
import { interactiveContentSchemaDef } from "../schema-defs/interactive-content.schema-def";
import { SchemaNames } from "../types/schema-names.enum";

const replySchema = new Schema<Reply, Model<Reply>>({
    ...userInteractionSchemaDef,
    likes: counterSchemaDef,
    commentId: idSchemaDef,
    content: interactiveContentSchemaDef
});

replySchema.index({ commentId: 1, _id: -1 });

export const ReplyModel = model<Reply, Model<Reply>>(SchemaNames.REPLY, replySchema);