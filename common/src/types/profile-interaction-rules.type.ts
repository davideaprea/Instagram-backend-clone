import { InteractionRule } from "./interaction-rule.enum";
import { ProfileVisibility } from "./profile-visibility.enum";

export type ProfileInteractionRules = {
    tag: InteractionRule,
    mention: InteractionRule
    visibility: ProfileVisibility
};