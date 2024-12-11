import { Router } from "express";

export const commentRouter: Router = Router();

commentRouter
.route("/")
.post()