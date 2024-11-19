import { Router } from "express";
import { handleDeleteProfilePic, handleEditProfile, handleEditProfilePic, handleGetFollowers, handleGetFollowings, handleGetProfileById, handleSearchProfiles } from "../controllers/profile.controller";
import { idSchema } from "@ig-clone/common";
import { multerConfig } from "../configs/multer.config";

export const profileRouter: Router = Router();

profileRouter.param("id", async (req, res, next) => {
    await idSchema.validateAsync(req.params.id);
    next();
});

profileRouter
    .route("/users")
    .patch(handleEditProfile);

profileRouter
    .route("/users/profilePics")
    .patch(
        multerConfig.single("profilePic"),
        handleEditProfilePic
    )
    .delete(handleDeleteProfilePic);

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