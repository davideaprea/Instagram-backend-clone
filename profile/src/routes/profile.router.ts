import { Router } from "express";
import { handleEditProfile, handleGetFollowers, handleGetFollowings, handleGetProfileById, handleSearchProfiles } from "../controllers/profile.controller";
import { idSchema } from "@ig-clone/common";

export const profileRouter: Router = Router();

profileRouter.param("id", async (req, res, next) => {
    await idSchema.required().validateAsync(req.params.id);
    next();
});

profileRouter
    .route("/users")
    .patch(handleEditProfile);

profileRouter
    .route("/users/:id")
    .get(handleGetProfileById);

profileRouter
    .route("/users/:id/followers/:lastId?")
    .get(handleGetFollowers);

profileRouter
    .route("/users/:id/followings/:lastId?")
    .get(handleGetFollowings);

/* profileRouter
.route("/users/:pattern")
.get(handleSearchProfiles); */