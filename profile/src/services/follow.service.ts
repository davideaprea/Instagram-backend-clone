import { transactionHandler } from "@ig-clone/common";
import { FollowModel, FollowRequestModel } from "../models/follow.model";
import { getProfileRules } from "./profile.service";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";
import { ProfileModel } from "../models/profile.model";
import { FollowDto } from "../types/custom-types/follow-dto.type";
import { ObjectId } from "mongoose";

export const follow = async (dto: FollowDto): Promise<void> => {
    transactionHandler(async session => {
        await FollowRequestModel.deleteOne(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );

        await FollowModel.create(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );

        await ProfileModel.findByIdAndUpdate(
            dto.userId,
            { $inc: { following: 1 } },
            { session }
        );

        await ProfileModel.findByIdAndUpdate(
            dto.followingUserId,
            { $inc: { followers: 1 } },
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
        await FollowModel.deleteOne(
            { userId: dto.userId, followingUserId: dto.followingUserId },
            { session }
        );

        await ProfileModel.findByIdAndUpdate(
            dto.userId,
            { $inc: { following: -1 } },
            { session }
        );

        await ProfileModel.findByIdAndUpdate(
            dto.followingUserId,
            { $inc: { followers: -1 } },
            { session }
        );
    });
}

export const getFollowRequests = async (currUserId: ObjectId) => {
    
}