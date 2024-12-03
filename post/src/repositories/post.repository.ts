import { RootFilterQuery } from "mongoose";
import { PostPreview } from "../types/post-preview.type";
import { PostModel } from "../models/post.model";
import { Post } from "../types/post.type";

export namespace PostRepository {
    export const getPostPage = async (userId: string, limit: number = 10, lastPostId?: string): Promise<PostPreview[]> => {
        const filters: RootFilterQuery<Post> = { userId };

        if (lastPostId) filters._id = { $gt: lastPostId };

        return await PostModel.aggregate([
            { $match: filters },
            {
                $sort: {
                    pinned: -1,
                    _id: -1
                }
            },
            { $limit: limit },
            {
                $project: {
                    userId: 1,
                    thumbnail: { $arrayElemAt: ["$medias", 0] }
                }
            }
        ]);
    }
}