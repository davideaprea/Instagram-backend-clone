import { RequestHandler } from "express";
import { InteractionRuleModel } from "../models/interaction-rule.model";
import { getInteractionRules } from "../services/interaction-rules.service";

export const handleGetInteractionRules: RequestHandler = async (req, res): Promise<void> => {
    const userId = req.currentUser!.userId;

    const rules = getInteractionRules(userId);

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