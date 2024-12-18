import { Router } from "express";
import { ReplyController } from "../controllers/reply.controller";
import { LikeController } from "../controllers/like.controller";
import { CommentModel } from "../models/comment.model";
import { CommentLikeModel } from "../models/like.model";
import { Routes } from "../types/routes.enum";

export const replyRouter: Router = Router();

replyRouter
    .route("/")
    .post(ReplyController.create);

replyRouter
    .route("/:id")
    .delete(ReplyController.remove);

replyRouter
    .route(`/:id/${Routes.LIKES}`)
    .post(LikeController.create(CommentModel, CommentLikeModel))
    .delete(LikeController.remove(CommentModel, CommentLikeModel));