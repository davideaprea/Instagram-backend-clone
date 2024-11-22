import { Router } from "express";
import { idSchema } from "@ig-clone/common";
import { multerConfig } from "../configs/multer.config";
import { ProfileController } from "../controllers/profile.controller";

export const profileRouter: Router = Router();

profileRouter.param("id", async (req, res, next) => {
    await idSchema.validateAsync(req.params.id);
    next();
});

profileRouter
    .route("/users")
    .patch(ProfileController.editProfile);

profileRouter
    .route("/users/profilePics")
    .patch(
        multerConfig.single("profilePic"),
        ProfileController.editProfilePic
    )
    .delete(ProfileController.deleteProfilePic);

profileRouter
    .route("/users/:id")
    .get(ProfileController.getProfileById);

profileRouter
    .route("/users/:id/followers/:lastId?")
    .get(ProfileController.getFollowers);

profileRouter
    .route("/users/:id/followings/:lastId?")
    .get(ProfileController.getFollowings);

/* profileRouter
.route("/users/:pattern")
.get(handleSearchProfiles); */