import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateJwt } from "../middlewares/validate-jwt.middleware";

export const authRouter: Router = Router();

authRouter.route("/register").post(AuthController.register);

authRouter.route("/login").post(AuthController.login);

authRouter.route("/users")
.delete(validateJwt, AuthController.deleteAccount);