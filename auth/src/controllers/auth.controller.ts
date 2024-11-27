import { RequestHandler } from "express";
import { LoginResponse } from "../types/login-response.type";
import { authProducer } from "../producers/auth.producer";
import { AuthTopics } from "@ig-clone/common";
import { AuthResponse } from "../types/auth-response.type";
import { AuthService } from "../services/auth.service";
import { registerSchema } from "../joi-schemas/register.scema";
import { loginSchema } from "../joi-schemas/login.schema";

export namespace AuthController {
    export const register: RequestHandler = async (req, res): Promise<void> => {
        await registerSchema.validateAsync(req.body);

        const authRes: AuthResponse = await AuthService.register(req.body);

        await authProducer.sendMsg(AuthTopics.USER_CREATE, authRes);

        res
            .status(201)
            .json(authRes);
    };

    export const login: RequestHandler = async (req, res): Promise<void> => {
        await loginSchema.validateAsync(req.body);
        
        const { jwt, ...userData }: LoginResponse = await AuthService.login(req.body);

        res
            .status(200)
            .header("Authorization", "Bearer " + jwt)
            .json(userData);
    };
}