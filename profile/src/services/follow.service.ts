import { transactionHandler } from "@ig-clone/common";
import { FollowModel } from "../models/follow.model";
import { getProfileRules } from "./profile.service";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";
import { ProfileModel } from "../models/profile.model";
import createHttpError from "http-errors";
import { ClientSession, ObjectId } from "mongoose";

export const updateFollowInfo = async (
    userId: string | ObjectId,
    followingUserId: string | ObjectId,
    session: ClientSession,
    multiplier: 1 | -1 = 1
): Promise<void> => {
    const updateResult = await ProfileModel.bulkWrite([
        {
            updateOne: {
                filter: { userId },
                update: { $inc: { following: 1 * multiplier } }
            }
        },
        {
            updateOne: {
                filter: { userId: followingUserId },
                update: { $inc: { followers: 1 * multiplier } }
            }
        }
    ], { session });

    if (updateResult.modifiedCount != 2) {
        throw new createHttpError.NotFound("Profile not found.");
    }
}

const follow = async (userId: string, followingUserId: string): Promise<void> => {
    transactionHandler(async session => {
        await updateFollowInfo(userId, followingUserId, session);

        await FollowModel.create(
            { userId, followingUserId, isAccepted: true },
            { session }
        );
    });
}

export const addFollowOrRequest = async (userId: string, followingUserId: string): Promise<{ isAccepted: boolean }> => {
    const profileRule = await getProfileRules(followingUserId);

    if (profileRule.visibility == ProfileVisibility.PUBLIC) {
        await follow(userId, followingUserId);
        return { isAccepted: true };
    }

    await FollowModel.create(
        {
            userId,
            followingUserId,
            isAccepted: false
        }
    );

    return { isAccepted: true };
}

export const unfollow = async (userId: string, followingUserId: string): Promise<void> => {
    transactionHandler(async session => {
        const deletionResult = await FollowModel.deleteOne(
            { userId, followingUserId },
            { session }
        );

        if (deletionResult.deletedCount != 1) {
            throw new createHttpError.NotFound("Follow relationship not found.")
        }

        await updateFollowInfo(userId, followingUserId, session, -1);
    });
}

export const acceptFollow = async (id: string, currUserId: string): Promise<void> => {
    transactionHandler(async session => {
        const res = await FollowModel.findOneAndUpdate(
            {
                _id: id,
                followingUserId: currUserId,
                isAccepted: false
            },
            { isAccepted: true }
        );

        if (!res) {
            throw new createHttpError.NotFound("Follow request not found.");
        }

        await updateFollowInfo(res.userId, res.followingUserId, session);
    });
}