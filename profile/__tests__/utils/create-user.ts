import { faker } from "@faker-js/faker";
import { ProfileModel } from "../../src/models/profile.model"
import { sign } from "jsonwebtoken";
import { InteractionRuleModel } from "../../src/models/interaction-rule.model";
import { Credentials } from "./credentials.type";

export const createUser = async (): Promise<Credentials> => {
    const user = await ProfileModel.create({
        username: faker.internet.username(),
        fullName: faker.person.fullName()
    });
    
    await InteractionRuleModel.create({
        userId: user._id
    });

    return {
        id: user._id,
        token: sign({ userId: user._id.toString() }, process.env.JWT_SECRET!)
    };
}