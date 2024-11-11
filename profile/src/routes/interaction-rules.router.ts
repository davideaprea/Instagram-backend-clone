import { Router } from "express";
import { handelEditInteractionRules, handleGetInteractionRules } from "../controllers/interaction-rules.controller";

export const interactionRulesRouter: Router = Router();

interactionRulesRouter
.route("/interaction-rules")
.get(handleGetInteractionRules)
.put(handelEditInteractionRules);