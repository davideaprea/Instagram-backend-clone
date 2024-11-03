import { RequestHandler } from "express";
import { BlockModel } from "../models/block.model";

export const handleGetBlockedUsers: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;

    const blockedUsers = await BlockModel.find({ userId });

    res
        .send(200)
        .json(blockedUsers);
}

export const handleBlockUser: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const blockedUserId: string = req.params.blockedUserId;

    await BlockModel.create({ userId, blockedUserId });

    res
        .status(204)
        .send();
}

export const handleUnblockUser: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const blockedUserId: string = req.params.blockedUserId;

    await BlockModel.deleteOne({ userId, blockedUserId });

    res
        .status(204)
        .send();
}