import { ObjectId } from "mongoose"

export type Block = {
    readonly userId: ObjectId
    readonly blockedUserId: ObjectId
}