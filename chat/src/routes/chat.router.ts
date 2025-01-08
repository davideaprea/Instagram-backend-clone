import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

export const chatRouter: Router = Router();

chatRouter
    .route("/")
    .post(ChatController.create);