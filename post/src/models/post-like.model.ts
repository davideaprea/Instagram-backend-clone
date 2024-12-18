import { model, Model, Schema } from "mongoose";
import { SchemaNames } from "../types/schema-names.enum";
import { PostInteraction } from "../types/post-interaction.type";
import { postInteractionSchemaDef } from "../schema-defs/post-interaction-schema-def";

const schema = new Schema<PostInteraction, Model<PostInteraction>>(postInteractionSchemaDef);

schema.index({ postId: 1, userId: 1 }, { unique: true });

export const PostLikeModel = model<PostInteraction, Model<PostInteraction>>(SchemaNames.POST_LIKE, schema);