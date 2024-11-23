import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const authRouter: Router = Router();

authRouter.route("/register").post(AuthController.register);

authRouter.route("/login").post(AuthController.login);