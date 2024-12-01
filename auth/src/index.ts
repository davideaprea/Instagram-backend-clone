import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import { authRouter } from './routes/auth.router';
import { handleError } from '@ig-clone/common';
import passport from 'passport';
import { googleStrategyInit } from './configs/google-oauth.config';
import { googleOAuthRouter } from './routes/google-oauth.router';

export const app: Express = express();

export const baseRoute: string = "/v1/auth";

app.use(json());

app.use(passport.initialize());

googleStrategyInit();

app.use(baseRoute, authRouter);
app.use(baseRoute + "/google", googleOAuthRouter);

app.use(handleError);