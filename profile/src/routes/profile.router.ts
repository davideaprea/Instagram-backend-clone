import { Router } from "express";
import { handleGetProfileByUsername, handleSearchProfiles } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/users/:username")
.get(handleGetProfileByUsername);

/* profileRouter
.route("/users/:pattern")
.get(handleSearchProfiles); */