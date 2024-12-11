import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";

export const commentRouter: Router = Router();

commentRouter
    .route("/")
    .post(CommentController.create);

commentRouter
    .route("/:id")
    .delete(CommentController.remove);