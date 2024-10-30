import { Request, RequestHandler } from "express";
import createHttpError from "http-errors";
import { JwtPayload, verify } from "jsonwebtoken";

const getJwtFromReq = (req: Request): string | undefined => {
    const authHeaders: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeaders?.slice(7);

    if (authHeaders?.startsWith("Bearer") && token) {
        return token;
    }
}

const decodeJwt = (token: string): JwtPayload | undefined => {
    try {
        return verify(token, process.env.JWT_SECRET!) as JwtPayload;
    }
    catch (e) {
        return;
    }
};

export const verifyJwt: RequestHandler = async (req, res, next): Promise<void> => {
    const token: string | undefined = getJwtFromReq(req);

    if (!token) {
        return next(new createHttpError.Unauthorized());
    }

    const jwt: JwtPayload | undefined = decodeJwt(token);

    if (!jwt) {
        return next(new createHttpError.Unauthorized());
    }

    req.currentUser = {
        userId: jwt.userId
    };

    next();
}