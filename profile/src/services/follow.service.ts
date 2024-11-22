import { transactionHandler } from "@ig-clone/common";
import createHttpError from "http-errors";
import { ClientSession, Types } from "mongoose";
import { areUsersBlocked } from "./block.service";
import { FollowIds } from "../types/custom-types/follow-ids.type";
import { ProfileService } from "./profile.service";
import { FollowRepository } from "../repositories/follow.repository";
import { ProfileRepository } from "../repositories/profile.repository";

export namespace FollowService {
    const updateFollowCounters = async (
        ids: FollowIds,
        session: ClientSession,
        multiplier: 1 | -1
    ): Promise<void> => {
        const modifiedCount: number = await ProfileRepository.updateFollowCounters(ids, session, multiplier);

        if (modifiedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }
    }

    const follow = async (ids: FollowIds): Promise<void> => {
        await transactionHandler(async session => {
            await updateFollowCounters(ids, session, 1);
            await FollowRepository.create(ids, session);
        });
    }

    export const addFollowOrRequest = async (ids: FollowIds): Promise<{ isAccepted: boolean }> => {
        const { userId, followingUserId } = ids;

        await areUsersBlocked(followingUserId, userId);

        if (!ProfileService.isProfilePrivate(followingUserId)) {
            await follow(ids);
            return { isAccepted: true };
        }

        await FollowRepository.createRequest(ids);

        return { isAccepted: true };
    }

    export const unfollow = async (ids: FollowIds, session: ClientSession): Promise<void> => {
        const deletedCount: number = await FollowRepository.deleteFollow(ids, session);

        if (deletedCount != 1) {
            throw new createHttpError.NotFound("Follow relationship not found.")
        }

        await updateFollowCounters(ids, session, 1);
    }

    export const acceptFollow = async (ids: FollowIds): Promise<void> => {
        await transactionHandler(async session => {
            const res = await FollowRepository.acceptFollow(ids, session);

            if (!res) {
                throw new createHttpError.NotFound("Follow request not found.");
            }

            await updateFollowCounters(ids, session, 1);
        });
    }

    export const removeMutualFollow = async (firstUserId: Types.ObjectId, secondUserId: Types.ObjectId, session: ClientSession) => {
        const deletedCount: number = await FollowRepository.removeMutualFollow(firstUserId, secondUserId, session);

        if (deletedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        const modifiedCount = await ProfileRepository.updateMutualCounters(firstUserId, secondUserId, session, -1);

        if (modifiedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }
    }

    export const transUnfollow = async (ids: FollowIds) => {
        await transactionHandler(async session => unfollow(ids, session));
    }
}