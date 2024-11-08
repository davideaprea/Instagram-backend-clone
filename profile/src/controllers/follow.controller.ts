import { RequestHandler } from "express";
import { acceptFollow, addFollowOrRequest, transUnfollow } from "../services/follow.service";

export const handleFollow: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const followingUserId: string = req.params.userId;

    const followRes = await addFollowOrRequest({ userId, followingUserId });

    res
        .status(200)
        .json(followRes);
}

export const handleAcceptFollow: RequestHandler = async (req, res) => {
    const followingUserId: string = req.currentUser!.userId;
    const userId: string = req.params.userId;

    await acceptFollow({ userId, followingUserId });

    res
        .status(204)
        .send();
}

export const handleUnfollow: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const followingUserId: string = req.params.userId;

    await transUnfollow({ userId, followingUserId });

    res
        .status(204)
        .send();
}