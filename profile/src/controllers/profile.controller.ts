import { RequestHandler } from "express";
import { BlockModel } from "../models/block.model";
import { Profile } from "../types/custom-types/profile.type";
import { Block } from "../types/custom-types/block.type";
import createHttpError from "http-errors";
import { getProfileByUsername, getProfilePage } from "../services/profile.service";
import { ProfileSearch } from "../types/custom-types/profile-search.type";

export const handleGetProfileByUsername: RequestHandler = async (req, res) => {
    const currUserId: string = req.currentUser!.userId;
    const profileUsername: string = req.params.username;

    const profile: Profile = await getProfileByUsername(profileUsername);
    const block: Block | null = await BlockModel.findOne({ userId: profile.userId, blockedUserId: currUserId });

    if (block) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    res
        .status(200)
        .json(profile);
}

export const handleSearchProfiles: RequestHandler = async (req, res): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const title: string = req.params.pattern.replaceAll("+", " ");
    const limit: number = Number(req.params.limit);

    const results: ProfileSearch[] = await getProfilePage(title, limit, lastId);

    res
        .status(200)
        .json(results);
}