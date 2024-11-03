import { Router } from "express";
import { handleGetProfileByUsername, handleSearchProfiles } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/:username")
.get(handleGetProfileByUsername);

profileRouter
.route("/:pattern")
.get(handleSearchProfiles);