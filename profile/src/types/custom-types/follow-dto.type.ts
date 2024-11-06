import { FollowIds } from "./follow-ids.type"

export type FollowDto = FollowIds & {
    isAccepted: boolean
};