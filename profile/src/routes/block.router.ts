import { Router } from "express";
import { idSchema } from "@ig-clone/common";
import { BlockController } from "../controllers/block.controller";

export const blockRouter: Router = Router();

blockRouter.param("blockedUserId", async (req, res, next) => {
    await idSchema.validateAsync(req.params.blockedUserId);
    next();
});

blockRouter
    .route("/blocks")
    .get(BlockController.getBlockedUsers);

blockRouter
    .route("/blocks/:blockedUserId")
    .post(BlockController.blockUser)
    .delete(BlockController.unblockUser);