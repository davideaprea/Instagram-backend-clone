import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { multerConfig } from "../configs/multer.config";
import { LikeController } from "../controllers/like.controller";
import { PostLikeModel } from "../models/like.model";
import { Routes } from "../types/routes.enum";
import { PostModel } from "../models/post.model";

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
    .route(`/:id/${Routes.LIKES}`)
    .post(LikeController.create(PostModel, PostLikeModel))
    .delete(LikeController.remove(PostModel, PostLikeModel));