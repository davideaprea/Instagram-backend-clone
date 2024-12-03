import { RequestHandler } from "express";
import { PostService } from "../services/post.service";

export namespace PostController {
    export const getPostPage: RequestHandler = async (req, res) => {
        const limit: number = Number(req.params.limit);
        const lastPostId: string = req.params.lastPostId;
        const userId: string = req.params.userId;
        const postPage = await PostService.getPostPage(userId, limit, lastPostId);

        res
        .set({"Cache-Control": "private, max-age=300"})
        .status(200)
        .json(postPage);
    }
}