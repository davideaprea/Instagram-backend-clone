import { Schema, SchemaDefinitionProperty, Types } from "mongoose";

export const idSchemaDef: SchemaDefinitionProperty<Schema.Types.ObjectId> = Object.freeze({
    type: Types.ObjectId,
    required: true,
    immutable: true
} as const);