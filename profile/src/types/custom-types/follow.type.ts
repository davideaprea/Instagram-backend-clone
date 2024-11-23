import { Schema } from "mongoose";

export type Follow = {
    readonly userId: Schema.Types.ObjectId,
    readonly followingUserId: Schema.Types.ObjectId,
    readonly time: number
    isAccepted: boolean
};