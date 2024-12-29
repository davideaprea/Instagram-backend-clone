import { ObjectId } from "mongoose"
import { MessageStatus } from "./message-status.enum"

export type Message = {
    chatId: ObjectId
    text: string
    status: MessageStatus
    time: number
}