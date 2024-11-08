import { model, Model, Schema, Types } from "mongoose";
import { InteractionRule } from "../types/enums/interaction-rule.enum";
import { ProfileInteractionRules } from "../types/custom-types/profile-interaction-rules.type";
import { ProfileSchemaNames } from "../types/enums/profile-schema-names.enum";
import { ProfileVisibility } from "../types/enums/profile-visibility.enum";

const interactionRuleSchema = new Schema<ProfileInteractionRules, Model<ProfileInteractionRules>>({
    userId: {
        type: Types.ObjectId,
        required: [true, "Profile id is required."],
        immutable: true,
        unique: true,
        ref: ProfileSchemaNames.PROFILE
    },
    tag: {
        type: String,
        required: true,
        default: InteractionRule.EVERYONE,
        enum: Object.values(InteractionRule)
    },
    mention: {
        type: String,
        required: true,
        default: InteractionRule.EVERYONE,
        enum: Object.values(InteractionRule)
    },
    visibility: {
        type: String,
        enum: Object.values(ProfileVisibility),
        default: ProfileVisibility.PUBLIC,
        required: true
    }
});

export const InteractionRuleModel = model<ProfileInteractionRules, Model<ProfileInteractionRules>>(ProfileSchemaNames.INTERACTION_RULE, interactionRuleSchema);