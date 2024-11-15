import { Router } from "express";
import { handleEditProfile, handleGetFollowers, handleGetFollowings, handleGetProfileById, handleSearchProfiles } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter
.route("/users")
.patch(handleEditProfile);

profileRouter
.route("/users/:id")
.get(handleGetProfileById);

profileRouter
.route("/users/:profileId/followers/:lastId?")
.get(handleGetFollowers);

profileRouter
.route("/users/:profileId/followings/:lastId?")
.get(handleGetFollowings);

/* profileRouter
.route("/users/:pattern")
.get(handleSearchProfiles); */