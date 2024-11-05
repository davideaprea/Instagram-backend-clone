import { RequestHandler } from "express";
import { acceptFollow, addFollowOrRequest } from "../services/follow.service";

export const handleFollow: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const followingUserId: string = req.params.followingUserId;

    await addFollowOrRequest(userId, followingUserId);

    res
        .status(204)
        .send();
}

export const handleAcceptFollow: RequestHandler = async (req, res) => {
    const followingUserId: string = req.currentUser!.userId;
    const followId: string = req.params.followId;

    await acceptFollow(followId, followingUserId);

    res
        .status(204)
        .send();
}