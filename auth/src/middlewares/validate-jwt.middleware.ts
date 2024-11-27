import { verifyJwt } from "@ig-clone/common";
import { UserModel } from "../models/user.model";
import { RequestHandler } from "express";

export const validateJwt: RequestHandler = verifyJwt(async userId => {
    return !!(await UserModel.findById(userId));
});