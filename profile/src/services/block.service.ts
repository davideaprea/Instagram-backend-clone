import { transactionHandler } from "@ig-clone/common"
import { BlockModel } from "../models/block.model"
import { FollowModel } from "../models/follow.model";
import { updateFollowInfo } from "./follow.service";
import { ProfileModel } from "../models/profile.model";
import createHttpError from "http-errors";

export const blockUser = async (userId: string, blockedUserId: string): Promise<void> => {
    transactionHandler(async session => {
        await BlockModel.create(
            { userId, blockedUserId },
            { session }
        );

        const deleteResult = await FollowModel.deleteMany(
            {
                $or: [
                    { userId, followingUserId: blockedUserId },
                    { userId: blockedUserId, followingUserId: userId }
                ]
            },
            { session }
        );

        if (deleteResult.deletedCount == 1) {
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

            const follow = followsToDelete[0];
            await updateFollowInfo(follow.userId, follow.followingUserId, session, -1);
        }
        else {
            const updateResult = await ProfileModel.bulkWrite([
                {
                    updateOne: {
                        filter: { userId },
                        update: { $inc: { followers: -1, following: -1 } }
                    }
                },
                {
                    updateOne: {
                        filter: { userId: blockedUserId },
                        update: { $inc: { followers: -1, following: -1 } }
                    }
                }
            ], { session });

            if (updateResult.modifiedCount != 2) {
                throw new createHttpError.NotFound("Profile not found.");
            }
        }
    });
}