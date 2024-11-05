import { transactionHandler } from "@ig-clone/common";
import { FollowModel } from "../models/follow.model";
import { getProfileRules } from "./profile.service";
import { FollowRequestStatus } from "../types/enums/follow-request-status.enum";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";
import { ProfileModel } from "../models/profile.model";
import { FollowDto } from "../types/custom-types/follow-dto.type";
import { ObjectId } from "mongoose";
import createHttpError from "http-errors";

export const follow = async (dto: FollowDto): Promise<void> => {
    transactionHandler(async session => {
        await FollowModel.create(
            { userId: dto.userId, followingUserId: dto.followingUserId, status: FollowRequestStatus.ACCEPTED },
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
        await FollowModel.create({ userId: dto.userId, followingUserId: dto.followingUserId });
    }
}

export const acceptFollow = async (requestId: ObjectId) => {
    transactionHandler(async session => {
        const follow = await FollowModel.findByIdAndUpdate(
            requestId,
            { status: FollowRequestStatus.ACCEPTED },
            { session }
        );

        if(!follow) {
            throw new createHttpError.NotFound("Follow request not found.");
        }

        await ProfileModel.findByIdAndUpdate(
            follow.userId,
            { $inc: { following: 1 } },
            { session }
        );

        await ProfileModel.findByIdAndUpdate(
            follow.followingUserId,
            { $inc: { followers: 1 } },
            { session }
        );
    });
}