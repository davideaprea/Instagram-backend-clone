import { Profile } from "@ig-clone/common";
import { ClientSession, FilterQuery, Types } from "mongoose";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Follow } from "../types/custom-types/follow.type";
import { FollowModel } from "../models/follow.model";
import { ProfileInteractionRules } from "@ig-clone/common/dist/types/profile-interaction-rules.type";
import { FollowIds } from "../types/custom-types/follow-ids.type";
import { ProfileDto } from "../types/custom-types/profile-dto.type";

export namespace ProfileRepository {
    export const queryProfileIfNotBlocked = async (currUserId: Types.ObjectId, queriedUserId: Types.ObjectId): Promise<Profile | undefined> => {
        const profiles = await ProfileModel.aggregate<Profile>([
            {
                $match: { _id: queriedUserId }
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

        return profiles[0];
    }

    export const queryProfilePage = async (currUserId: Types.ObjectId, query: FilterQuery<Profile>, limit: number = 10): Promise<ProfileSearch[]> => {
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

    export const queryFollowersPage = async (userId: string, lastId?: string): Promise<ProfileSearch[]> => {
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

    export const queryFollowingsPage = async (userId: string, lastId?: string): Promise<ProfileSearch[]> => {
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

    export const queryInteractionRules = async (userId: string): Promise<ProfileInteractionRules | undefined> => {
        const profile = await ProfileModel.findById(userId, { interactionRules: 1, _id: 0 });

        return profile?.interactionRules;
    }

    export const updateFollowCounters = async (
        ids: FollowIds,
        session: ClientSession,
        multiplier: 1 | -1
    ): Promise<number> => {
        const { userId, followingUserId } = ids;

        const updateResult = await ProfileModel.bulkWrite([
            {
                updateOne: {
                    filter: { _id: userId },
                    update: { $inc: { following: 1 * multiplier } }
                }
            },
            {
                updateOne: {
                    filter: { _id: followingUserId },
                    update: { $inc: { followers: 1 * multiplier } }
                }
            }
        ], { session });

        return updateResult.modifiedCount;
    }

    export const updateMutualCounters = async (
        firstUserId: string,
        secondUserId: string,
        session: ClientSession,
        multiplier: 1 | -1
    ): Promise<number> => {
        const updateResult = await ProfileModel.bulkWrite([
            {
                updateOne: {
                    filter: { _id: firstUserId },
                    update: { $inc: { followers: multiplier, following: multiplier } }
                }
            },
            {
                updateOne: {
                    filter: { _id: secondUserId },
                    update: { $inc: { followers: multiplier, following: multiplier } }
                }
            }
        ], { session });

        return updateResult.modifiedCount;
    }

    export const createProfiles = async (dtos: ProfileDto[]): Promise<void> => {
        await ProfileModel.insertMany(
            dtos,
            { ordered: false }
        );
    }
}