import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { multerConfig } from "../configs/multer.config";
import { LikeController } from "../controllers/like.controller";
import { CommentModel } from "../models/comment.model";
import { CommentLikeModel } from "../models/like.model";

export const postRouter: Router = Router();

postRouter
    .route("/")
    .post(
        multerConfig.array("medias"),
        PostController.create
    );

postRouter
    .route("/:id")
    .delete(PostController.deletePost);

postRouter
    .route("/:id/likes")
    .post(LikeController.create(CommentModel, CommentLikeModel))
    .delete(LikeController.remove(CommentModel, CommentLikeModel));