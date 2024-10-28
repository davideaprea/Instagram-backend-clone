import { config } from 'dotenv';
config({ path: "./.env" });

import express, { Express, json } from 'express';
import passport from 'passport';

export const app: Express = express();

app.use(json());

app.use(passport.initialize());