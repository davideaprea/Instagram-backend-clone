import { Router } from "express";
import { handleAcceptFollow, handleFollow, handleUnfollow } from "../controllers/follow.controller";

export const followRouter: Router = Router();

followRouter
.route("/follows/:userId")
.post(handleFollow)
.delete(handleUnfollow)
.patch(handleAcceptFollow);