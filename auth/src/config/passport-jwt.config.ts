import { use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "../models/user.model";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

use(
    new Strategy(
        opts,
        async (payload, done) => {
            try {
                const user = await UserModel.findOne({ email: payload.email });
                if (user) return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);