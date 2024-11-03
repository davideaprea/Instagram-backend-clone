import { Router } from "express";
import { handleBlockUser, handleGetBlockedUsers, handleUnblockUser } from "../controllers/block.controller";

export const blockRouter: Router = Router();

blockRouter
.route("/blocks")
.get(handleGetBlockedUsers);

blockRouter
.route("/blocks/:blockedUserId")
.post(handleBlockUser)
.delete(handleUnblockUser);