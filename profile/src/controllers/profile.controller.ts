import { RequestHandler } from "express";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Types } from "mongoose";
import { areUsersBlocked } from "../services/block.service";
import { profileProducer } from "../producers/profile.producer";
import { deleteFile, EditProfileMsg, idSchema, ProfileTopics, saveFile } from "@ig-clone/common";
import { editProfileSchema } from "../joi-schemas/edit-profile.schema";
import { ProfileModel } from "../models/profile.model";
import { ProfileService } from "../services/profile.service";
import { ProfileRepository } from "../repositories/profile.repository";

export namespace ProfileController {
    export const getProfileById: RequestHandler = async (req, res) => {
        const currUserId: string = req.currentUser!.userId;
        const queriedUserId: string = req.params.id;

        const profile = await ProfileService.getProfileIfNotBlocked(new Types.ObjectId(currUserId), new Types.ObjectId(queriedUserId));

        res
            .status(200)
            .json(profile);
    }

    export const searchProfiles: RequestHandler = async (req, res): Promise<void> => {
        const lastId: string | undefined = req.params.lastId;
        const pattern: string = req.params.pattern.replaceAll("+", " ");
        const limit: number = Number(req.params.limit);
        const currUserId: string = req.currentUser!.userId;

        await idSchema.validateAsync(lastId);

        const results: ProfileSearch[] = await ProfileService.getProfilePage(new Types.ObjectId(currUserId), pattern, limit, lastId);

        res
            .status(200)
            .json(results);
    }

    export const getFollowers: RequestHandler = async (req, res): Promise<void> => {
        const userId: string = req.currentUser!.userId;
        const profileId: string = req.params.id;
        const lastId: string = req.params.lastId;

        await idSchema.validateAsync(lastId);

        if (userId != profileId) {
            await areUsersBlocked(userId, profileId);
            await ProfileService.isProfilePrivate(profileId);
        }

        const followers = await ProfileRepository.queryFollowersPage(userId, lastId);

        res
            .status(200)
            .json(followers);
    }

    export const getFollowings: RequestHandler = async (req, res): Promise<void> => {
        const userId: string = req.currentUser!.userId;
        const profileId: string = req.params.id;
        const lastId: string = req.params.lastId;

        await idSchema.validateAsync(lastId);

        if (userId != profileId) {
            await areUsersBlocked(userId, profileId);
            await ProfileService.isProfilePrivate(profileId);
        }

        const followers = ProfileRepository.queryFollowingsPage(userId, lastId);

        res
            .status(200)
            .json(followers);
    }

    export const editProfile: RequestHandler = async (req, res): Promise<void> => {
        const userId: string = req.currentUser!.userId;

        await editProfileSchema.validateAsync(req.body);

        await ProfileService.editProfile(userId, req.body);

        const msg: EditProfileMsg = {
            id: userId,
            ...req.body
        }

        await profileProducer.sendMsg(ProfileTopics.PROFILE_UPDATE, msg);

        res
            .status(204)
            .send();
    }

    export const editProfilePic: RequestHandler = async (req, res): Promise<void> => {
        const userId: string = req.currentUser!.userId;

        const fileName: string = await saveFile(req.file!);
        await ProfileModel.updateOne({ _id: userId }, { profilePic: fileName });

        res
            .status(200)
            .json({
                profilePic: fileName
            });
    }

    export const deleteProfilePic: RequestHandler = async (req, res): Promise<void> => {
        const userId: string = req.currentUser!.userId;

        const user = await ProfileModel.findById(userId, { profilePic: 1 });
        const profilePic = user!.profilePic;

        if (profilePic) await deleteFile(profilePic);

        res
            .status(204)
            .send();
    }

    export const getInteractionRules: RequestHandler = async (req, res): Promise<void> => {
        const userId = req.currentUser!.userId;

        const rules = ProfileService.getInteractionRules(userId);

        res
            .status(200)
            .json(rules);
    }

    export const editInteractionRules: RequestHandler = async (req, res): Promise<void> => {
        const userId = req.currentUser!.userId;

        const updateRes = await ProfileModel.updateOne(
            { _id: userId },
            req.body
        );

        res
            .status(204)
            .send();
    }
}