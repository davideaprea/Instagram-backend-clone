import { RequestHandler } from "express";
import { editProfile, getFollowers, getFollowings, getProfileByUsername, getProfilePage } from "../services/profile.service";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Types } from "mongoose";
import { areUsersBlocked } from "../services/block.service";
import { isProfilePrivate } from "../services/interaction-rules.service";
import { profileProducer } from "../producers/profile.producer";
import { deleteFile, EditProfileMsg, idSchema, ProfileTopics, saveFile } from "@ig-clone/common";
import { editProfileSchema } from "../joi-schemas/edit-profile.schema";
import { ProfileModel } from "../models/profile.model";

export const handleGetProfileById: RequestHandler = async (req, res) => {
    const currUserId: string = req.currentUser!.userId;
    const queriedUserId: string = req.params.id;

    const profile = await getProfileByUsername(new Types.ObjectId(currUserId), new Types.ObjectId(queriedUserId));

    res
        .status(200)
        .json(profile);
}

export const handleSearchProfiles: RequestHandler = async (req, res): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const pattern: string = req.params.pattern.replaceAll("+", " ");
    const limit: number = Number(req.params.limit);
    const currUserId: string = req.currentUser!.userId;

    await idSchema.validateAsync(lastId);

    const results: ProfileSearch[] = await getProfilePage(new Types.ObjectId(currUserId), pattern, limit, lastId);

    res
        .status(200)
        .json(results);
}

export const handleGetFollowers: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;
    const profileId: string = req.params.id;
    const lastId: string = req.params.lastId;

    await idSchema.validateAsync(lastId);

    if (userId != profileId) {
        await areUsersBlocked(userId, profileId);
        await isProfilePrivate(profileId);
    }

    const followers = await getFollowers(userId, lastId);

    res
        .status(200)
        .json(followers);
}

export const handleGetFollowings: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;
    const profileId: string = req.params.id;
    const lastId: string = req.params.lastId;

    await idSchema.validateAsync(lastId);

    if (userId != profileId) {
        await areUsersBlocked(userId, profileId);
        await isProfilePrivate(profileId);
    }

    const followers = getFollowings(userId, lastId);

    res
        .status(200)
        .json(followers);
}

export const handleEditProfile: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;

    await editProfileSchema.validateAsync(req.body);

    await editProfile(userId, req.body);

    const msg: EditProfileMsg = {
        id: userId,
        ...req.body
    }

    await profileProducer.sendMsg(ProfileTopics.PROFILE_UPDATE, msg);

    res
        .status(204)
        .send();
}

export const handleEditProfilePic: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;

    const fileName: string = await saveFile(req.file!);
    await ProfileModel.updateOne({ _id: userId }, { profilePic: fileName });

    res
        .status(200)
        .json({
            profilePic: fileName
        });
}

export const handleDeleteProfilePic: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;

    const user = await ProfileModel.findById(userId, { profilePic: 1 });
    const profilePic = user!.profilePic;

    if (profilePic) await deleteFile(profilePic);

    res
        .status(204)
        .send();
}