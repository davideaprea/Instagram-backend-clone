import { Follow } from "./follow.type";

export type FollowDto = Pick<Follow, "userId" | "followingUserId">;