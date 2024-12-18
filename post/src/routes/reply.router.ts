import { Router } from "express";
import { ReplyController } from "../controllers/reply.controller";
import { LikeController } from "../controllers/like.controller";
import { ReplyLikeModel } from "../models/like.model";
import { Routes } from "../types/routes.enum";
import { ReplyModel } from "../models/reply.model";

export const replyRouter: Router = Router();

replyRouter
    .route("/")
    .post(ReplyController.create);

replyRouter
    .route("/:id")
    .delete(ReplyController.remove);

replyRouter
    .route(`/:id/${Routes.LIKES}`)
    .post(LikeController.create(ReplyModel, ReplyLikeModel))
    .delete(LikeController.remove(ReplyModel, ReplyLikeModel));