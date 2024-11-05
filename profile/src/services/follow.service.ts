import { transactionHandler } from "@ig-clone/common";
import { FollowModel, FollowRequestModel } from "../models/follow.model";
import { getProfileRules } from "./profile.service";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";
import { ProfileModel } from "../models/profile.model";
import { FollowDto } from "../types/custom-types/follow-dto.type";
import createHttpError from "http-errors";
import { Follow } from "../types/custom-types/follow.type";

export const follow = async (dto: FollowDto): Promise<void> => {
    transactionHandler(async session => {
        await FollowRequestModel.deleteOne(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );

        const updateResult = await ProfileModel.bulkWrite([
            {
                updateOne: {
                    filter: { userId: dto.userId },
                    update: { $inc: { following: 1 } }
                }
            },
            {
                updateOne: {
                    filter: { userId: dto.followingUserId },
                    update: { $inc: { followers: 1 } }
                }
            }
        ], { session });

        if (updateResult.modifiedCount != 2) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        await FollowModel.create(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );
    });
}

export const addFollowOrRequest = async (dto: FollowDto): Promise<void> => {
    const profileRule = await getProfileRules(dto.followingUserId);

    if (profileRule.visibility == ProfileVisibility.PUBLIC) {
        await follow(dto);
    }
    else {
        await FollowRequestModel.create({ userId: dto.userId, followingUserId: dto.followingUserId });
    }
}

export const unfollow = async (dto: FollowDto): Promise<void> => {
    transactionHandler(async session => {
        const deletionResult = await FollowModel.deleteOne(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );

        const updateResult = await ProfileModel.bulkWrite([
            {
                updateOne: {
                    filter: { userId: dto.userId },
                    update: { $inc: { following: -1 } }
                }
            },
            {
                updateOne: {
                    filter: { userId: dto.followingUserId },
                    update: { $inc: { followers: -1 } }
                }
            }
        ], { session });

        if (deletionResult.deletedCount + updateResult.modifiedCount != 3) {
            throw new createHttpError.NotFound("Follow relationship not found.")
        }
    });
}