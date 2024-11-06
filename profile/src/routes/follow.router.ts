import { Router } from "express";
import { handleAcceptFollow, handleFollow, handleUnfollow } from "../controllers/follow.controller";

export const followRouter: Router = Router();

followRouter
.route("/follows/:followingUserId")
.post(handleFollow)
.delete(handleUnfollow);

followRouter
.route("/follows/:userId")
.patch(handleAcceptFollow);