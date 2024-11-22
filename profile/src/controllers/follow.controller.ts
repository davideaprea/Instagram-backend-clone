import { RequestHandler } from "express";
import { FollowService } from "../services/follow.service";
import { Types } from "mongoose";

export namespace FollowController {
    export const follow: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const followingUserId: string = req.params.userId;

        const followRes = await FollowService.addFollowOrRequest({ userId, followingUserId });

        res
            .status(200)
            .json(followRes);
    }

    export const acceptFollow: RequestHandler = async (req, res) => {
        const followingUserId: string = req.currentUser!.userId;
        const userId: string = req.params.userId;

        await FollowService.acceptFollow({ userId, followingUserId });

        res
            .status(204)
            .send();
    }

    export const unfollow: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const followingUserId: string = req.params.userId;

        await FollowService.transUnfollow({ userId, followingUserId });

        res
            .status(204)
            .send();
    }
}