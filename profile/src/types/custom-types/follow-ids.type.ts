import { Types } from "mongoose"

export type FollowIds = {
    readonly userId: string
    readonly followingUserId: string
}