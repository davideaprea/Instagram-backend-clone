import { SchemaDefinitionProperty } from "mongoose";

export const counterSchemaDef: SchemaDefinitionProperty<number> = Object.freeze({
    type: Number,
    default: 0,
    min: 0
} as const);