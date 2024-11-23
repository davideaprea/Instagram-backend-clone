import createHttpError from "http-errors";
import { ProfileModel } from "../models/profile.model";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Profile, transactionHandler } from "@ig-clone/common";
import { ObjectId, Types } from "mongoose";
import { ProfileDto } from "../types/custom-types/profile-dto.type";
import { EditProfileDto } from "../types/custom-types/edit-profile-dto.type";
import { ProfileInteractionRules } from "@ig-clone/common/dist/types/profile-interaction-rules.type";
import { ProfileVisibility } from "@ig-clone/common/dist/types/profile-visibility.enum";
import { ProfileRepository } from "../repositories/profile.repository";

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
        });
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
}