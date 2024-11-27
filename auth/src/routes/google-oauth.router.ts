import { Router } from "express";
import passport from "passport";
import { baseRoute } from "..";
import { generateJwt } from "../services/jwt-manager.service";
import { UserDocument } from "../types/user-document.type";

export const googleOAuthRouter: Router = Router();

googleOAuthRouter.route("/").get(
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

googleOAuthRouter.route("/redirect").get(
    passport.authenticate("google", {
        session: false,
        failureRedirect: `http://${process.env.HOST_NAME}${baseRoute}/google/error`
    }),
    (req, res) => {
        const user = req.user as UserDocument;

        res.header("Authorization", "Bearer " + generateJwt(user.id))
        res.redirect(`http://${process.env.HOST_NAME}${baseRoute}/google/success`);
    }
);

googleOAuthRouter.route("/success/:jwt").get(
    (req, res) => {
        res.send("Success!");
    }
);

googleOAuthRouter.route("/error").get(
    (req, res) => {
        res.send("Error!");
    }
);