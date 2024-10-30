import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { authRouter } from './routes/auth.router';
import { handleError } from '@ig-clone/common';

export const app: Express = express();

app.use(json());

app.use("/", authRouter);

app.use(handleError);