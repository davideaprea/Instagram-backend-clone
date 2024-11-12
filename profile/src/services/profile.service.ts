import createHttpError from "http-errors";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Profile, transactionHandler } from "@ig-clone/common";
import { FilterQuery, ObjectId, Types } from "mongoose";
import { InteractionRuleModel } from "../models/interaction-rule.model";
import { ProfileDto } from "../types/custom-types/profile-dto.type";
import { FollowModel } from "../models/follow.model";
import { Follow } from "../types/custom-types/follow.type";

/**
* Finds a profile by its username, checking if
* the current user hasn't been blocked by the
* queried profile.
*/
export const getProfileByUsername = async (currUserId: Types.ObjectId, username: string): Promise<Profile> => {
    const profiles = await ProfileModel.aggregate<Profile>([
        {
            $match: { username }
        },
        {
            $lookup: {
                from: "blocks",
                let: { targetUserId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$userId", "$$targetUserId"] },
                                    { $eq: ["$blockedUserId", currUserId] }
                                ]
                            }
                        }
                    }
                ],
                as: "blockStatus"
            }
        },
        {
            $match: { "blockStatus": { $size: 0 } }
        },
        {
            $project: { blockStatus: 0 }
        }
    ]);

    if (profiles.length == 0) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    return profiles[0];
}

/**
* Finds profiles by the given pattern, checking if
* the current user hasn't been blocked by the
* queried profiles.
*/
export const getProfilePage = async (currUserId: Types.ObjectId, pattern: string, limit: number = 10, lastId?: string): Promise<ProfileSearch[]> => {
    const query: Record<string, any> = { $text: { $search: pattern } };

    if (lastId) query._id = { $gt: lastId };
    if (limit > 20 || limit <= 0) limit = 10;

    return await ProfileModel
        .aggregate([
            { $match: query },
            { $sort: { _id: 1 } },
            {
                $lookup: {
                    from: "blocks",
                    let: { targetUserId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$targetUserId"] },
                                        { $eq: ["$blockedUserId", currUserId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "blockStatus"
                }
            },
            {
                $match: { "blockStatus": { $size: 0 } }
            },
            {
                $project: {
                    username: 1,
                    profilePic: 1,
                    fullName: 1
                }
            },
            { $limit: limit }
        ]);
}

export const getProfileById = async (id: ObjectId): Promise<Profile> => {
    const profile = await ProfileModel.findById(id);

    if (!profile) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    return profile;
}

export const createProfile = async (dto: ProfileDto) => {
    await transactionHandler(async session => {
        const { id, fullName, username } = dto;

        await ProfileModel.create(
            [{
                _id: id,
                fullName,
                username
            }],
            { session });

        await InteractionRuleModel.create(
            [{ userId: id }],
            { session }
        );
    });
}

export const getFollowers = async (userId: string, lastId?: string): Promise<ProfileSearch[]> => {
    const query: FilterQuery<Follow> = {
        followingUserId: new Types.ObjectId(userId),
        ...(lastId && { userId: { $gt: lastId } })
    };

    return await FollowModel.aggregate([
        { $match: query },
        { $sort: { userId: 1 } },
        {
            $lookup: {
                from: "profiles",
                localField: "userId",
                foreignField: "_id",
                as: "followers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            profilePic: 1
                        }
                    }
                ]
            }
        },
        { $unwind: { path: "$followers", preserveNullAndEmptyArrays: true } },
        { $replaceRoot: { newRoot: "$followers" } },
        { $limit: 20 }
    ]);
}

export const getFollowings = async (userId: string, lastId?: string): Promise<ProfileSearch[]> => {
    const query: FilterQuery<Follow> = {
        userId: new Types.ObjectId(userId),
        ...(lastId && { followingUserId: { $gt: lastId } })
    };

    return await FollowModel.aggregate([
        { $match: query },
        { $sort: { followingUserId: 1 } },
        {
            $lookup: {
                from: "profiles",
                localField: "followingUserId",
                foreignField: "_id",
                as: "followers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            profilePic: 1
                        }
                    }
                ]
            }
        },
        { $unwind: { path: "$followers", preserveNullAndEmptyArrays: true } },
        { $replaceRoot: { newRoot: "$followers" } },
        { $limit: 20 }
    ]);
}