import { RequestHandler } from "express";
import { PostService } from "../services/post.service";
import { createPostSchema } from "../joi-schemas/create-post.schema";
import { Types } from "mongoose";

export namespace PostController {
    export const getPostPage: RequestHandler = async (req, res): Promise<void> => {
        const limit: number = Number(req.params.limit);
        const lastPostId: string = req.params.lastPostId;
        const userId: string = req.params.userId;
        const postPage = await PostService.getPostPage(userId, limit, lastPostId);

        res
            .set({ "Cache-Control": "private, max-age=300" })
            .status(200)
            .json(postPage);
    }

    export const create: RequestHandler = async (req, res): Promise<void> => {
        req.body.medias = req.files;
        console.log("BODY", req.body)
        await createPostSchema.validateAsync(req.body);

        req.body.userId = new Types.ObjectId(req.currentUser!.userId);

        const post = await PostService.create(req.body);

        res
            .status(201)
            .json(post);
    }

    export const deletePost: RequestHandler = async (req, res) => {
        const userId: string = req.currentUser!.userId;
        const postId: string = req.params.postId;

        await PostService.deletePost(postId, userId);

        res
            .status(204)
            .send();
    }
}