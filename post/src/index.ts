import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { handleError, verifyJwt } from '@ig-clone/common';

export const app: Express = express();

export const baseRoute: string = "/v1/post";

app.use(json());

app.use(verifyJwt(async (id) => {
    return !!(await ProfileModel.findById(id));
}));

app.use(handleError);