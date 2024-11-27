import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model";
import { randomUUID } from "crypto";
import { baseRoute } from "..";

export const googleStrategyInit = () => {
    passport.use(new Strategy(
        {
            callbackURL: `http://${process.env.HOST_NAME}${baseRoute}/google/redirect`,
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        async (accToken, refreshToken, profile, done) => {
            const { email, name } = profile._json;

            let user = await UserModel.findOne({ email });

            if (!user) {
                user = await UserModel.create({
                    email,
                    fullName: name,
                    username: name!.toLowerCase().replaceAll(" ", "_") + randomUUID()
                });
            }

            return done(null, user);
        }
    ));
}