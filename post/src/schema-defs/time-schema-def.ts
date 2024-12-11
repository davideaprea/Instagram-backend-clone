import { Schema, SchemaDefinitionProperty } from "mongoose";

export const timeSchemaDef: SchemaDefinitionProperty<number> = Object.freeze({
    type: Number,
    immutable: true,
    required: true,
    default: Date.now()
} as const);