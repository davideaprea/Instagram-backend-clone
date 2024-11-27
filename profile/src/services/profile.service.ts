import createHttpError from "http-errors";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Profile, transactionHandler } from "@ig-clone/common";
import { ObjectId, Types } from "mongoose";
import { EditProfileDto } from "../types/custom-types/edit-profile-dto.type";
import { ProfileInteractionRules } from "@ig-clone/common/dist/types/profile-interaction-rules.type";
import { ProfileVisibility } from "@ig-clone/common/dist/types/profile-visibility.enum";
import { ProfileRepository } from "../repositories/profile.repository";
import { BlockModel } from "../models/block.model";
import { FollowModel } from "../models/follow.model";

export namespace ProfileService {
    /**
    * Finds a profile by its username, checking if
    * the current user hasn't been blocked by the
    * queried profile.
    */
    export const getProfileIfNotBlocked = async (currUserId: Types.ObjectId, queriedUserId: Types.ObjectId): Promise<Profile> => {
        const profile = await ProfileRepository.queryProfileIfNotBlocked(currUserId, queriedUserId);

        if (!profile) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        return profile;
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

        return await ProfileRepository.queryProfilePage(currUserId, query, limit);
    }

    export const getProfileById = async (id: ObjectId): Promise<Profile> => {
        const profile = await ProfileModel.findById(id);

        if (!profile) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        return profile;
    }

    export const editProfile = async (userId: string, dto: EditProfileDto) => {
        const result = await ProfileModel.updateOne(
            { _id: userId },
            dto
        );

        if (result.modifiedCount != 1) {
            throw new createHttpError.NotFound("Profile not found");
        }
    }

    export const getInteractionRules = async (userId: string): Promise<ProfileInteractionRules> => {
        const rules = await ProfileRepository.queryInteractionRules(userId);

        if (!rules) {
            throw new createHttpError.NotFound("Profile not found.");
        }

        return rules;
    }

    export const isProfilePrivate = async (userId: string): Promise<void> => {
        const rules = await getInteractionRules(userId);

        if (rules.visibility == ProfileVisibility.PRIVATE) {
            throw new createHttpError.Forbidden("This profile is private.");
        }
    }

    export const deleteAccount = async (id: string): Promise<void> => {
        await transactionHandler(async session => {
            const follows = await FollowModel.find(
                {
                    $or: [
                        { userId: id },
                        { followingUserId: id }
                    ]
                },
                undefined,
                { session }
            );

            const profilesFollowingUser: string[] = follows
                .filter(doc => doc.followingUserId.toString() == id)
                .map(doc => doc.followingUserId.toString());

            const profilesFollowedByUser: string[] = follows
                .filter(doc => doc.userId.toString() == id)
                .map(doc => doc.userId.toString());

            await ProfileModel.bulkWrite([
                {
                    deleteOne: {
                        filter: {
                            _id: id
                        }
                    }
                },
                {
                    updateMany: {
                        filter: { _id: { $in: profilesFollowingUser } },
                        update: { following: { $inc: -1 } }
                    }
                },
                {
                    updateMany: {
                        filter: { _id: { $in: profilesFollowedByUser } },
                        update: { followers: { $inc: -1 } }
                    }
                }
            ], { session });

            await BlockModel.deleteMany({
                $or: [
                    { userId: id },
                    { blockedUserId: id }
                ]
            }, { session });

            await FollowModel.deleteMany({
                $or: [
                    { userId: id },
                    { followingUserId: id }
                ]
            }, { session });
        });
    }
}