import { Router } from "express";
import { handleBlockUser, handleGetBlockedUsers, handleUnblockUser } from "../controllers/block.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/blocks")
.get(handleGetBlockedUsers);

profileRouter
.route("/blocks/:blockedUserId")
.post(handleBlockUser)
.delete(handleUnblockUser);