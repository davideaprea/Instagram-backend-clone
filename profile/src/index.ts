import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { handleError, verifyJwt } from '@ig-clone/common';
import { profileRouter } from './routes/profile.router';
import { blockRouter } from './routes/block.router';
import { followRouter } from './routes/follow.router';
import { ProfileModel } from './models/profile.model';

export const app: Express = express();

export const baseRoute: string = "/v1/profile";

app.use(json());

app.use(verifyJwt(async (id) => {
    return !!(await ProfileModel.findById(id));
}));

app.use(baseRoute, profileRouter);
app.use(baseRoute, blockRouter);
app.use(baseRoute, followRouter);

app.use(handleError);