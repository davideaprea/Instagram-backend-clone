import createHttpError from "http-errors";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Profile } from "@ig-clone/common";

export const getProfileByUsername = async (username: string): Promise<Profile> => {
    const profile = await ProfileModel.findOne({ username }, { userId: 0 });

    if (!profile) {
        throw new createHttpError.NotFound("Profile not found");
    }

    return profile;
}

export const getProfilePage = async (pattern: string, limit: number = 10, lastId?: string): Promise<ProfileSearch[]> => {
    const query: Record<string, any> = { $text: { $search: pattern } };

    if (lastId) query._id = { $gt: lastId };
    if (limit > 50 || limit <= 0) limit = 10;

    return await ProfileModel
        .find(query, {
            username: 1,
            profilePic: 1,
            fullName: 1
        })
        .sort({ _id: 1 })
        .limit(limit);
}