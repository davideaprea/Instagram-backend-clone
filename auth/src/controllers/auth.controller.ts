import { RequestHandler } from "express";
import { login, register } from "../services/auth.service";
import { LoginResponse } from "../types/login-response.type";
import { authProducer } from "../producers/auth.producer";
import { AuthTopics, UserCreateDto } from "@ig-clone/common";

export const handleRegistration: RequestHandler = async (req, res): Promise<void> => {
    const authRes: UserCreateDto = await register(req.body);

    await authProducer.sendMsg(AuthTopics.USER_CREATE, authRes);

    res
        .status(201)
        .json(authRes);
};

export const handleLogin: RequestHandler = async (req, res): Promise<void> => {
    const { jwt, ...userData }: LoginResponse = await login(req.body);

    res
        .status(200)
        .header("Authorization", "Bearer " + jwt)
        .json(userData);
};