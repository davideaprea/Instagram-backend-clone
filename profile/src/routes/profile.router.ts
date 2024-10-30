import { Router } from "express";
import { handleGetProfileByUsername, handleSearchProfiles } from "../controllers/profile.controller";
import { verifyJwt } from "@ig-clone/common";

export const profileRouter: Router = Router();

profileRouter
.route("/:username")
.get(verifyJwt, handleGetProfileByUsername);

profileRouter
.route("/:pattern")
.get(verifyJwt, handleSearchProfiles);