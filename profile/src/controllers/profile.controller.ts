import { RequestHandler } from "express";
import { getFollowers, getFollowings, getProfileByUsername, getProfilePage } from "../services/profile.service";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Schema, Types } from "mongoose";
import { areUsersBlocked } from "../services/block.service";
import { isProfilePrivate } from "../services/interaction-rules.service";

export const handleGetProfileByUsername: RequestHandler = async (req, res) => {
    const currUserId: string = req.currentUser!.userId;
    const profileUsername: string = req.params.username;

    const profile = await getProfileByUsername(new Types.ObjectId(currUserId), profileUsername);

    res
        .status(200)
        .json(profile);
}

export const handleSearchProfiles: RequestHandler = async (req, res): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const pattern: string = req.params.pattern.replaceAll("+", " ");
    const limit: number = Number(req.params.limit);
    const currUserId: string = req.currentUser!.userId;

    const results: ProfileSearch[] = await getProfilePage(new Types.ObjectId(currUserId), pattern, limit, lastId);

    res
        .status(200)
        .json(results);
}

export const handleGetFollowers: RequestHandler = async (req, res): Promise<void> => {
    const userId: string = req.currentUser!.userId;
    const profileId: string = req.params.profileId;
    const lastId: string = req.params.lastId;

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
    const profileId: string = req.params.profileId;
    const lastId: string = req.params.lastId;

    if (userId != profileId) {
        await areUsersBlocked(userId, profileId);
        await isProfilePrivate(profileId);
    }

    const followers = getFollowings(new Schema.Types.ObjectId(userId), lastId);

    res
        .status(200)
        .json(followers);
}