import { ObjectId } from "mongoose";
import { FollowRequestStatus } from "../enums/follow-request-status.enum";

export type Follow = {
    readonly userId: ObjectId,
    readonly followingUserId: ObjectId,
    status: FollowRequestStatus,
    readonly time: number
};