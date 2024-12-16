import { Model } from "mongoose";
import { Likeable } from "../types/likeable.type";
import { transactionHandler } from "@ig-clone/common";

export namespace LikeService {
    export const create = async (LikedResourceModel: Model<Likeable>, LikeModel: Model, likedResourceId: string) => {
        return await transactionHandler(async session => {

            await LikedResourceModel.updateOne(
                { _id: likedResourceId },
                { $inc: { likes: 1 } },
                { session }
            );
        });
    }
}