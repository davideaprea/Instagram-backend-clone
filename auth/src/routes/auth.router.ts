import { Router } from "express";
import { handleLogin, handleRegistration } from "../controllers/auth.controller";

export const authRouter: Router = Router();

authRouter.route("/register").post(handleRegistration);

authRouter.route("/login").post(handleLogin);