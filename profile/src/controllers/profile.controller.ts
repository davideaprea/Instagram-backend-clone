import { RequestHandler } from "express";
import { getProfileByUsername, getProfilePage } from "../services/profile.service";
import { ProfileSearch } from "../types/custom-types/profile-search.type";
import { Types } from "mongoose";

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