import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Error } from "mongoose";
import { MongoServerError } from "mongodb";
import Joi from "joi";

export const handleError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let status: number = 500, messages: string[] = [];

    if (createHttpError.isHttpError(err)) {
        status = err.status;
        messages = [err.message];
    }
    else if (err instanceof Error.ValidationError) {
        status = 400;
        messages = Object.values(err.errors).map(err => err.message);
    }
    else if (err instanceof MongoServerError || err?.constructor?.name == "MongoServerError") {
        const mongoErr: MongoServerError = err as MongoServerError;
        status = 400;

        switch (mongoErr.code) {
            case 11000:
                status = 409;

                for (const key in mongoErr.keyValue) {
                    messages.push(mongoErr.keyValue[key] + " is already taken.");
                }

                break;
        }
    }
    else if(err instanceof Joi.ValidationError) {
        status = 400;
        messages = err.details.map(e => e.message);
    }

    res
        .status(status)
        .json({ messages });
}