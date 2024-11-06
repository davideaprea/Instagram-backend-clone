import { ObjectId } from "mongoose"

export type FollowIds = {
    readonly userId: string | ObjectId
    readonly followingUserId: string | ObjectId
}