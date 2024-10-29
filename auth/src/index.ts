import { config } from 'dotenv';
config({ path: "./.env" });

if(!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable must be defined.");
}

import express, { Express, json } from 'express';
import { initialize } from 'passport';
import { authRouter } from './routes/auth.router';

export const app: Express = express();

app.use(json());

app.use("/", authRouter);

app.use(initialize());