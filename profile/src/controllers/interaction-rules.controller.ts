import { RequestHandler } from "express";
import { InteractionRuleModel } from "../models/interaction-rule.model";
import createHttpError from "http-errors";

export const handleGetInteractionRules: RequestHandler = async (req, res): Promise<void> => {
    const userId = req.currentUser?.userId;

    const rules = await InteractionRuleModel.findById(userId);

    if (!rules) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    res
        .status(200)
        .json(rules);
}

export const handelEditInteractionRules: RequestHandler = async (req, res): Promise<void> => {
    const userId = req.currentUser?.userId;

    const updateRes = await InteractionRuleModel.updateOne(
        { _id: userId },
        req.body
    );

    res
        .status(204)
        .send();
}