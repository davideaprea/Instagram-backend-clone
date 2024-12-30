import { model, Model, Schema, Types } from "mongoose";
import { Chat } from "../types/chat.type";
import { ChatType } from "../types/chat-type.enum";
import { SchemaNames } from "../types/schema-names.enum";

const schema = new Schema<Chat, Model<Chat>>({
    name: String,
    type: {
        required: true,
        immutable: true,
        enum: Object.values(ChatType)
    },
    users: [Types.ObjectId],
    picture: String
});

schema.index({ users: 1 });

export const ChatModel = model<Chat, Model<Chat>>(SchemaNames.CHAT, schema);