import { ObjectId } from "mongoose"

export type Message = {
    chatId: ObjectId
    senderId: ObjectId
    text: string
    answeredToMessageId: ObjectId
    info: {
        sent: number
        received: number
        seen: number
    }
}