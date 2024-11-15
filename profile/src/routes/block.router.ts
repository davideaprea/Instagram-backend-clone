import { Router } from "express";
import { handleBlockUser, handleGetBlockedUsers, handleUnblockUser } from "../controllers/block.controller";
import { idSchema } from "@ig-clone/common";

export const blockRouter: Router = Router();

blockRouter.param("blockedUserId", async (req, res, next) => {
    await idSchema.required().validateAsync(req.params.blockedUserId);
    next();
});

blockRouter
    .route("/blocks")
    .get(handleGetBlockedUsers);

blockRouter
    .route("/blocks/:blockedUserId")
    .post(handleBlockUser)
    .delete(handleUnblockUser);