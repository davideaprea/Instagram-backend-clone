import { RequestHandler } from "express";
import { addFollowOrRequest, follow } from "../services/follow.service";

export const handleFollow: RequestHandler = async (req, res) => {
    const userId: string = req.currentUser!.userId;
    const followingUserId: string = req.params.followingUserId;

    await addFollowOrRequest({
        userId,
        followingUserId
    });

    res
        .status(204)
        .send();
}

export const handleAcceptFollowRequest: RequestHandler = async (req, res) => {
    const followingUserId: string = req.currentUser!.userId;
    const userId: string = req.params.followingUserId;

    await follow({
        userId,
        followingUserId
    });

    res
        .status(204)
        .send();
}