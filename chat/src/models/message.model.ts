import { model, Model, Schema, Types } from "mongoose";
import { Message } from "../types/message.type";
import { MessageStatus } from "../types/message-status.enum";
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
    status: {
        type: String,
        enum: Object.values(MessageStatus),
        required: true,
        default: MessageStatus.SENT
    },
    time: {
        type: Number,
        immutable: true,
        default: Date.now
    }
});

export const MessageModel = model<Message, Model<Message>>(SchemaNames.MESSAGE, schema);