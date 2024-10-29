import { sign } from "jsonwebtoken";

export const generateJwt = (username: string): string => {
    return sign(
        { username },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXP_TIME }
    );
}