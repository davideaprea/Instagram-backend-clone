import { ObjectId } from "mongoose"

export type UserInteraction = {
    userId: ObjectId
    time: number
}