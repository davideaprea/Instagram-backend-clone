import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { multerConfig } from "../configs/multer.config";

export const postRouter: Router = Router();

postRouter
    .route("/")
    .post(
        multerConfig.array("medias"),
        PostController.create
    );