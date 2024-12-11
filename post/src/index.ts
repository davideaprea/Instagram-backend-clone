import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { handleError, verifyJwt } from '@ig-clone/common';
import { UserModel } from './models/user.model';
import { postRouter } from './routes/post.router';
import { Routes } from './types/routes.enum';
import { commentRouter } from './routes/comment.router';

export const app: Express = express();

app.use(json());

app.use(verifyJwt(async (id) => {
    return !!(await UserModel.findById(id));
}));

app.use(Routes.BASE, postRouter);
app.use(`${Routes.BASE}/${Routes.COMMENTS}`, commentRouter);

app.use((err, req, res, next) => {
    console.log("ERR", err);
    next(err);
},
handleError);