import { transactionHandler } from "@ig-clone/common";
import { FollowModel } from "../models/follow.model";
import { getProfileRules } from "./profile.service";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";
import { ProfileModel } from "../models/profile.model";
import createHttpError from "http-errors";
import { ClientSession, ObjectId } from "mongoose";
import { areUsersBlocked } from "./block.service";
import { FollowIds } from "../types/custom-types/follow-ids.type";

const updateFollowInfo = async (
    ids: FollowIds,
    session: ClientSession,
    multiplier: 1 | -1 = 1
): Promise<void> => {
    const { userId, followingUserId } = ids;

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

const follow = async (ids: FollowIds): Promise<void> => {
    const { userId, followingUserId } = ids;

    await transactionHandler(async session => {
        await updateFollowInfo(ids, session);

        await FollowModel.create(
            [{ userId, followingUserId, isAccepted: true }],
            { session }
        );
    });
}

export const addFollowOrRequest = async (ids: FollowIds): Promise<{ isAccepted: boolean }> => {
    const { userId, followingUserId } = ids;

    await areUsersBlocked(followingUserId, userId);

    const profileRule = await getProfileRules(followingUserId);

    if (profileRule.visibility == ProfileVisibility.PUBLIC) {
        await follow(ids);
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

export const unfollow = async (ids: FollowIds, session: ClientSession): Promise<void> => {
    const { userId, followingUserId } = ids;

    const deletionResult = await FollowModel.deleteOne(
        { userId, followingUserId },
        { session }
    );

    if (deletionResult.deletedCount != 1) {
        throw new createHttpError.NotFound("Follow relationship not found.")
    }

    await updateFollowInfo(ids, session, -1);
}

export const acceptFollow = async (ids: FollowIds): Promise<void> => {
    const { userId, followingUserId } = ids;

    await transactionHandler(async session => {
        const res = await FollowModel.findOneAndUpdate(
            {
                userId,
                followingUserId,
                isAccepted: false
            },
            { isAccepted: true }
        );

        if (!res) {
            throw new createHttpError.NotFound("Follow request not found.");
        }

        await updateFollowInfo(res, session);
    });
}

export const removeRelationship = async (firstUserId: string | ObjectId, secondUserId: string | ObjectId, session: ClientSession) => {
    const deleteResult = await FollowModel.deleteMany(
        {
            $or: [
                { userId: firstUserId, followingUserId: secondUserId },
                { userId: secondUserId, followingUserId: firstUserId }
            ]
        },
        { session }
    );

    if (deleteResult.deletedCount != 2) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    const updateResult = await ProfileModel.bulkWrite([
        {
            updateOne: {
                filter: { userId: firstUserId },
                update: { $inc: { followers: -1, following: -1 } }
            }
        },
        {
            updateOne: {
                filter: { userId: secondUserId },
                update: { $inc: { followers: -1, following: -1 } }
            }
        }
    ], { session });

    if (updateResult.modifiedCount != 2) {
        throw new createHttpError.NotFound("Profile not found.");
    }
}

export const transUnfollow = async (ids: FollowIds) => {
    await transactionHandler(async session => unfollow(ids, session));
}