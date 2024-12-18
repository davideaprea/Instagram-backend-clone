import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { LikeController } from "../controllers/like.controller";
import { CommentModel } from "../models/comment.model";
import { CommentLikeModel } from "../models/like.model";

export const commentRouter: Router = Router();

commentRouter
    .route("/")
    .post(CommentController.create);

commentRouter
    .route("/:id")
    .delete(CommentController.remove);

commentRouter
    .route("/:id/likes")
    .post(LikeController.create(CommentModel, CommentLikeModel))
    .delete(LikeController.remove(CommentModel, CommentLikeModel));