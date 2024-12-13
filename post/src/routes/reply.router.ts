import { Router } from "express";
import { ReplyController } from "../controllers/reply.controller";

export const replyRouter: Router = Router();

replyRouter
    .route("/")
    .post(ReplyController.create);