import { transactionHandler } from "@ig-clone/common"
import { BlockModel } from "../models/block.model"
import { FollowModel } from "../models/follow.model";
import { removeRelationship, unfollow } from "./follow.service";
import createHttpError from "http-errors";
import { ClientSession, ObjectId } from "mongoose";

export const blockUser = async (userId: string, blockedUserId: string): Promise<void> => {
    transactionHandler(async session => {
        await BlockModel.create(
            { userId, blockedUserId },
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

        if (followsToDelete.length == 1) {
            await unfollow(firstFollow, session);
        }
        else if (followsToDelete.length == 2) {
            await removeRelationship(firstFollow.userId, firstFollow.followingUserId, session);
        }
    });
}

export const areUsersBlocked = async (userId: string | ObjectId, blockedUserId: string | ObjectId, session?: ClientSession): Promise<void> => {
    const block = await BlockModel.findOne(
        {
            $or: [
                { userId, blockedUserId },
                { userId: blockedUserId, blockedUserId: userId }
            ]
        },
        undefined,
        { session }
    );

    if (block) {
        throw new createHttpError.NotFound("Profile not found.");
    }
}