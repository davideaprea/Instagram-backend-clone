import { ObjectId } from "mongoose";
import { FollowRequestStatus } from "./follow-request-status.enum";

export type Follow = {
    userId: ObjectId,
    followingUserId: ObjectId,
    status: FollowRequestStatus,
    time: number
};