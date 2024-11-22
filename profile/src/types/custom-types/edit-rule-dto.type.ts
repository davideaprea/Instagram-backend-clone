import { InteractionRule } from "../../../../common/src/types/interaction-rule.enum";
import { ProfileInteractionRules } from "../../../../common/src/types/profile-interaction-rules.type";

export type EditRuleDto = {
    rule: keyof ProfileInteractionRules,
    value: InteractionRule
};