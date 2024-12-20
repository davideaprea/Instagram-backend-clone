import { ClientSession, Model } from "mongoose";
import { Likeable } from "../types/likeable.type";
import { transactionHandler } from "@ig-clone/common";
import { Like } from "../types/like.type";
import createHttpError from "http-errors";

export namespace LikeService {
    export const create = transactionHandler(
        async <T extends Likeable>(session: ClientSession, LikedResourceModel: Model<T>, LikeModel: Model<Like>, resourceId: string, userId: string) => {
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
        },
        { writeConcern: { w: 1 } }
    );

    export const remove = transactionHandler(
        async <T extends Likeable>(session: ClientSession, LikedResourceModel: Model<T>, LikeModel: Model<Like>, resourceId: string, userId: string) => {
            const editRes = await LikedResourceModel.updateOne(
                { _id: resourceId },
                { $inc: { likes: -1 } },
                { session }
            );

            if (editRes.modifiedCount == 0) {
                throw new createHttpError.NotFound("Liked resource not found.");
            }

            const delRes = await LikeModel.deleteOne(
                { resourceId, userId },
                { session }
            );

            if (delRes.deletedCount == 0) {
                throw new createHttpError.NotFound("Like not found.");
            }
        },
        { writeConcern: { w: 1 } }
    );
}