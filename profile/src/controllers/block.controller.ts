import { RequestHandler } from "express";
import { BlockModel } from "../models/block.model";
import createHttpError from "http-errors";
import { getPage } from "@ig-clone/common";
import { BlockService } from "../services/block.service";

export namespace BlockController {
    export const getBlockedUsers: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const lastId: string = req.params.lastId;

        const blockedUsers = await getPage(
            BlockModel,
            { userId },
            20,
            lastId
        );

        res
            .status(200)
            .json(blockedUsers);
    }

    export const blockUser: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const blockedUserId: string = req.params.blockedUserId;

        if (userId == blockedUserId) {
            throw new createHttpError.BadRequest("You can't block yourself.")
        }

        await BlockService.blockUser(userId, blockedUserId);

        res
            .status(204)
            .send();
    }

    export const unblockUser: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const blockedUserId: string = req.params.blockedUserId;

        const deleteRes = await BlockModel.deleteOne({ userId, blockedUserId });

        if (deleteRes.deletedCount == 0) {
            throw new createHttpError.NotFound("Profile not found");
        }

        res
            .status(204)
            .send();
    }
}