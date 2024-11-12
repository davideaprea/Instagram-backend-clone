import createHttpError from "http-errors";
import { InteractionRuleModel } from "../models/interaction-rule.model";
import { ProfileInteractionRules } from "../types/custom-types/profile-interaction-rules.type";
import { Schema } from "mongoose";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";

export const getInteractionRules = async (userId: string | Schema.Types.ObjectId): Promise<ProfileInteractionRules> => {
    const rules = await InteractionRuleModel.findById(userId);

    if (!rules) {
        throw new createHttpError.NotFound("Profile not found.");
    }

    return rules;
}

export const isProfilePrivate = async (profileId: string) => {
    const rules = await InteractionRuleModel.findOne({ userId: profileId });

    if (rules?.visibility == ProfileVisibility.PRIVATE) {
        throw new createHttpError.Forbidden("This profile is private.");
    }
}