import { Router } from "express";
import { handleEditProfile, handleGetFollowers, handleGetFollowings, handleGetProfileByUsername, handleSearchProfiles } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/users")
.patch(handleEditProfile);

profileRouter
.route("/users/:username")
.get(handleGetProfileByUsername);

profileRouter
.route("/users/:profileId/followers/:lastId?")
.get(handleGetFollowers);

profileRouter
.route("/users/:profileId/followings/:lastId?")
.get(handleGetFollowings);

/* profileRouter
.route("/users/:pattern")
.get(handleSearchProfiles); */