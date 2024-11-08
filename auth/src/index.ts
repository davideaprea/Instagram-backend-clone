import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { authRouter } from './routes/auth.router';
import { handleError } from '@ig-clone/common';

export const app: Express = express();

export const baseRoute: string = "/v1/auth";

app.use(json());

app.use(baseRoute, authRouter);

app.use(handleError);