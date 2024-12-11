import { RequestHandler } from "express";
import { CommentService } from "../services/comment.service";
import { createCommentSchema } from "../joi-schemas/create-comment.schema";
import { CommentModel } from "../models/comment.model";

export namespace CommentController {
    export const create: RequestHandler = async (req, res): Promise<void> => {
        await createCommentSchema.validateAsync(req.body, { abortEarly: false });

        req.body.userId = req.currentUser!.userId;

        const comment = await CommentService.create(req.body);

        res
            .status(200)
            .json(comment);
    }

    export const remove: RequestHandler = async (req, res): Promise<void> => {
        await CommentService.remove(req.params.id, req.currentUser!.userId);

        res
            .status(204)
            .send();
    }

    export const pin: RequestHandler = async (req, res) => {
        const commentId: string = req.params.id;

        await CommentModel.updateOne({ _id: commentId }, { pinned: true });

        res
            .status(204)
            .send();
    }
}