import { ObjectId } from "mongoose";

export type Follow = {
    readonly userId: ObjectId,
    readonly followingUserId: ObjectId,
    readonly time: number
    isAccepted: boolean
};