import { SchemaDefinitionProperty, Types } from "mongoose";
import { InteractiveContent } from "../types/interactive-content.type";

export const interactiveContentSchemaDef: SchemaDefinitionProperty<InteractiveContent> = Object.freeze({
    text: String,
    tags: Array<Types.ObjectId>,
    hashtags: Array<String>
} as const);