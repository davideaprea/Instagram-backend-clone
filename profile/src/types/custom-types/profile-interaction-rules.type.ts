import { ObjectId } from "mongoose";
import { InteractionRule } from "../enums/interaction-rule.enum";
import { ProfileVisibility } from "../enums/profile-visibility.enum";

export type ProfileInteractionRules = {
    readonly userId: ObjectId
    tag: InteractionRule,
    mention: InteractionRule
    visibility: ProfileVisibility
};