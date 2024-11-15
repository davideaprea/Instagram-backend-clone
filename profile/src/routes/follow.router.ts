import { Router } from "express";
import { handleAcceptFollow, handleFollow, handleUnfollow } from "../controllers/follow.controller";
import { idSchema } from "../joi-schemas/id.schema";

export const followRouter: Router = Router();

followRouter.param("userId", async (req, res, next) => {
    await idSchema.validateAsync(req.params.userId);
    next();
});

followRouter
.route("/follows/:userId")
.post(handleFollow)
.delete(handleUnfollow)
.patch(handleAcceptFollow);