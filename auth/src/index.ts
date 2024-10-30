import { config } from 'dotenv';

config({ path: "./.env" });

import 'express-async-errors';
import express, { Express, json } from 'express';
import passport from 'passport';
import { authRouter } from './routes/auth.router';
import { handleError } from './controllers/error.controller';

export const app: Express = express();

app.use(json());

app.use("/", authRouter);

app.use(passport.initialize());

app.use(handleError);