import { sign } from "jsonwebtoken";

export const generateJwt = (userId: string): string => {
    return sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXP_TIME }
    );
}