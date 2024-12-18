import { BlockModel, transactionHandler } from "@ig-clone/common"
import { FollowModel } from "../models/follow.model";
import createHttpError from "http-errors";
import { ClientSession } from "mongoose";
import { BlockRepository } from "../repositories/block.repository";
import { FollowService } from "./follow.service";
import { FollowIds } from "../types/custom-types/follow-ids.type";

export namespace BlockService {
    export const blockUser = transactionHandler(async (session, userId: string, blockedUserId: string) => {
        await BlockModel.create(
            [{ userId, blockedUserId }],
            { session }
        );

        const followsToDelete = await FollowModel.find(
            {
                $or: [
                    { userId, followingUserId: blockedUserId },
                    { userId: blockedUserId, followingUserId: userId }
                ]
            },
            undefined,
            { session }
        );

        const firstFollow = followsToDelete[0];
        const ids: FollowIds = {
            userId: firstFollow?.userId?.toString(),
            followingUserId: firstFollow?.followingUserId?.toString()
        };

        if (followsToDelete.length == 1) {
            await FollowService.unfollow(ids, session);
        }
        else if (followsToDelete.length == 2) {
            await FollowService.removeMutualFollow(ids, session);
        }
    });

    export const areUsersBlocked = async (userId: string, blockedUserId: string, session?: ClientSession): Promise<void> => {
        if (await BlockRepository.areUsersBlocked(userId, blockedUserId, session)) {
            throw new createHttpError.NotFound("Profile not found.");
        }
    }
}