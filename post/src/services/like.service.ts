import { Model } from "mongoose";
import { Likeable } from "../types/likeable.type";
import { transactionHandler } from "@ig-clone/common";
import { Like } from "../types/like.type";
import createHttpError from "http-errors";

export namespace LikeService {
    export const create = async (LikedResourceModel: Model<Likeable>, LikeModel: Model<Like>, resourceId: string, userId: string) => {
        return await transactionHandler(async session => {
            const res = await LikedResourceModel.updateOne(
                { _id: resourceId },
                { $inc: { likes: 1 } },
                { session }
            );

            if (res.modifiedCount == 0) {
                throw new createHttpError.NotFound("Liked resource not found.");
            }

            return await LikeModel.create(
                [{ resourceId, userId }],
                { session }
            );
        });
    }

    export const remove = async (LikedResourceModel: Model<Likeable>, LikeModel: Model<Like>, resourceId: string, userId: string) => {
        await transactionHandler(async session => {
            const res = await LikedResourceModel.updateOne(
                { _id: resourceId },
                { $inc: { likes: -1 } },
                { session }
            );

            if (res.modifiedCount == 0) {
                throw new createHttpError.NotFound("Liked resource not found.");
            }

            await LikeModel.deleteOne(
                { resourceId, userId },
                { session }
            );
        });
    }
}