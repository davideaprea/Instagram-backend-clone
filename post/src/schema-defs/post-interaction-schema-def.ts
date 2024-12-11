import { SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { PostInteraction } from "../types/post-interaction.type";
import { userInteractionSchemaDef } from "./user-interaction.schema-def";
import { idSchemaDef } from "./id.schema-def";

export const postInteractionSchemaDef: SchemaDefinition<SchemaDefinitionType<PostInteraction>> = {
    ...userInteractionSchemaDef,
    postId: idSchemaDef
};