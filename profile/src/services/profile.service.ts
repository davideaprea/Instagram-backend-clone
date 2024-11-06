import createHttpError from "http-errors";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Profile } from "@ig-clone/common";
import { ObjectId, Types } from "mongoose";
import { InteractionRuleModel } from "../models/interaction-rule.model";
import { ProfileInteractionRules } from "../types/custom-types/profile-interaction-rules.type";

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
                let: { targetUserId: "$userId" },
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
                    let: { targetUserId: "$userId" },
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

export const getProfileRules = async (userId: string | ObjectId): Promise<ProfileInteractionRules> => {
    const rules = await InteractionRuleModel.findOne({ userId });

    if (!rules) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    return rules;
}