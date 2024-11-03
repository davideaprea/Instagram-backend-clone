import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { handleError, verifyJwt } from '@ig-clone/common';
import { profileRouter } from './routes/profile.router';
import { blockRouter } from './routes/block.router';

export const app: Express = express();

app.use(json());

app.use(verifyJwt);

app.use(profileRouter);
app.use(blockRouter);

app.use(handleError);