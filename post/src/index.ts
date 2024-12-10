import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { handleError, verifyJwt } from '@ig-clone/common';
import { UserModel } from './models/user.model';
import { postRouter } from './routes/post.router';

export const app: Express = express();

export const baseRoute: string = "/v1/posts";

app.use(json());

app.use(verifyJwt(async (id) => {
    return !!(await UserModel.findById(id));
}));

app.use(baseRoute, postRouter);

app.use(handleError);