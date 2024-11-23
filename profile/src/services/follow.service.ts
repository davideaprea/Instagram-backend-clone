import { transactionHandler } from "@ig-clone/common";
import createHttpError from "http-errors";
import { ClientSession } from "mongoose";
import { FollowIds } from "../types/custom-types/follow-ids.type";
import { ProfileService } from "./profile.service";
import { FollowRepository } from "../repositories/follow.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import { BlockService } from "./block.service";
import { ProfileVisibility } from "@ig-clone/common/dist/types/profile-visibility.enum";

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

        await BlockService.areUsersBlocked(followingUserId, userId);
        const rules = await ProfileService.getInteractionRules(followingUserId);

        if (rules.visibility == ProfileVisibility.PUBLIC) {
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

        await updateFollowCounters(ids, session, -1);
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

    export const removeMutualFollow = async (ids: FollowIds, session: ClientSession) => {
        const deletedCount: number = await FollowRepository.removeMutualFollow(ids, session);

        if (deletedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        const modifiedCount = await ProfileRepository.updateMutualCounters(ids.userId, ids.followingUserId, session, -1);

        if (modifiedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }
    }

    export const transUnfollow = async (ids: FollowIds) => {
        await transactionHandler(async session => unfollow(ids, session));
    }
}