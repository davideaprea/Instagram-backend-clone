import { RequestHandler } from "express";
import { AuthResponse } from "../types/auth-response.type";
import { login, register } from "../services/auth.service";
import { LoginResponse } from "../types/login-response.type";

export const handleRegistration: RequestHandler = async (req, res): Promise<void> => {
    const authRes: AuthResponse = await register(req.body);

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