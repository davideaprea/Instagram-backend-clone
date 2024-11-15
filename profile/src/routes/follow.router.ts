import { Router } from "express";
import { handleAcceptFollow, handleFollow, handleUnfollow } from "../controllers/follow.controller";
import { idSchema } from "@ig-clone/common";

export const followRouter: Router = Router();

followRouter.param("userId", async (req, res, next) => {
    await idSchema.required().validateAsync(req.params.userId);
    next();
});

followRouter
.route("/follows/:userId")
.post(handleFollow)
.delete(handleUnfollow)
.patch(handleAcceptFollow);