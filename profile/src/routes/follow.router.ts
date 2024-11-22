import { Router } from "express";
import { idSchema } from "@ig-clone/common";
import { FollowController } from "../controllers/follow.controller";

export const followRouter: Router = Router();

followRouter.param("userId", async (req, res, next) => {
    await idSchema.validateAsync(req.params.userId);
    next();
});

followRouter
.route("/follows/:userId")
.post(FollowController.follow)
.delete(FollowController.unfollow)
.patch(FollowController.acceptFollow);