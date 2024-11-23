import { ClientSession } from "mongoose";
import { FollowIds } from "../types/custom-types/follow-ids.type";
import { FollowModel } from "../models/follow.model";
import { Follow } from "../types/custom-types/follow.type";

export namespace FollowRepository {
    export const create = async (ids: FollowIds, session: ClientSession): Promise<void> => {
        const { userId, followingUserId } = ids;

        await FollowModel.create(
            [{ userId, followingUserId, isAccepted: true }],
            { session }
        );
    }

    export const createRequest = async (ids: FollowIds): Promise<void> => {
        const { userId, followingUserId } = ids;

        await FollowModel.create(
            {
                userId,
                followingUserId,
                isAccepted: false
            }
        );
    }

    export const deleteFollow = async (ids: FollowIds, session: ClientSession): Promise<number> => {
        const { userId, followingUserId } = ids;

        const deletionResult = await FollowModel.deleteOne(
            { userId, followingUserId, isAccepted: true },
            { session }
        );

        return deletionResult.deletedCount;
    }

    export const acceptFollow = async (ids: FollowIds, session: ClientSession): Promise<Follow | null> => {
        const { userId, followingUserId } = ids;

        const follow = await FollowModel.findOneAndUpdate(
            {
                userId,
                followingUserId,
                isAccepted: false
            },
            { isAccepted: true },
            { session }
        );

        return follow;
    }

    export const removeMutualFollow = async (ids: FollowIds, session: ClientSession): Promise<number> => {
        const deleteResult = await FollowModel.deleteMany(
            {
                $or: [
                    { userId: ids.userId, followingUserId: ids.followingUserId },
                    { userId: ids.followingUserId, followingUserId: ids.userId }
                ]
            },
            { session }
        );

        return deleteResult.deletedCount;
    }
}