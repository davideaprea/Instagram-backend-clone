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

    const userId: string = user._id.toString();

    return {
        id: userId,
        token: sign({ userId }, process.env.JWT_SECRET!)
    };
}