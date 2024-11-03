import { Router } from "express";
import { handleGetProfileByUsername, handleSearchProfiles } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/profiles/:username")
.get(handleGetProfileByUsername);

profileRouter
.route("/profiles/:pattern")
.get(handleSearchProfiles);