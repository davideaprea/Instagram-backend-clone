import { ObjectId } from "mongoose"
import { ChatType } from "./chat-type.enum"

export type Chat = {
    users: ObjectId[]
    type: ChatType
    name: string
}