import { model, Model, Schema, Types } from "mongoose";
import { Message } from "../types/message.type";
import { SchemaNames } from "../types/schema-names.enum";

const schema = new Schema<Message, Model<Message>>({
    chatId: {
        type: Types.ObjectId,
        required: true,
        immutable: true
    },
    text: {
        type: String,
        required: true
    },
    info: {
        seen: Number,
        received: Number,
        sent: {
            type: Number,
            default: Date.now(),
            immutable: true
        }
    },
    senderId: {
        type: Types.ObjectId,
        required: true,
        immutable: true
    }
});

schema.index({ chatId: 1 });

export const MessageModel = model<Message, Model<Message>>(SchemaNames.MESSAGE, schema);