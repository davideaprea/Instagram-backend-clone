import { InteractionRule } from "../enums/interaction-rule.enum";
import { ProfileInteractionRules } from "./profile-interaction-rules.type";

export type EditRuleDto = {
    rule: keyof ProfileInteractionRules,
    value: InteractionRule
};