import { RequestHandler } from "express";
import { Model } from "mongoose";
import { Like } from "../types/like.type";
import { Likeable } from "../types/likeable.type";
import { LikeService } from "../services/like.service";

export namespace LikeController {
    export const create = <T extends Likeable>(LikedResourceModel: Model<T>, LikeModel: Model<Like>): RequestHandler => {
        return async (req, res): Promise<void> => {
            const like = await LikeService.create(
                LikedResourceModel,
                LikeModel,
                req.params.id,
                req.currentUser!.userId
            );

            res
                .status(201)
                .json(like);
        }
    }

    export const remove = <T extends Likeable>(LikedResourceModel: Model<T>, LikeModel: Model<Like>): RequestHandler => {
        return async (req, res): Promise<void> => {
            await LikeService.remove(
                LikedResourceModel,
                LikeModel,
                req.params.id,
                req.currentUser!.userId
            );

            res
                .status(204)
                .send();
        }
    }
}