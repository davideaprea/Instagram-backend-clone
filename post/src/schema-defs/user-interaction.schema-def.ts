import { SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { UserInteraction } from "../types/user-interaction.type";
import { idSchemaDef } from "./id.schema-def";
import { timeSchemaDef } from "./time-schema-def";

export const userInteractionSchemaDef: SchemaDefinition<SchemaDefinitionType<UserInteraction>> = {
    userId: idSchemaDef,
    time: timeSchemaDef
};