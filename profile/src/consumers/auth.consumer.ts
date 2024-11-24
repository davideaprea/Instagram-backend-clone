import { Consumer } from "kafkajs";
import { AuthEvents, AuthTopics, KafkaBatchConsumer } from "@ig-clone/common";
import { kafkaClient } from "../configs/kafka-client.config";
import { ProfileDto } from "../types/custom-types/profile-dto.type";
import { Types } from "mongoose";
import { ProfileRepository } from "../repositories/profile.repository";

const consumer: Consumer = kafkaClient.consumer({
    groupId: "profile-group",
    sessionTimeout: 30000,
    allowAutoTopicCreation: false
});

export const authConsumer = new KafkaBatchConsumer<AuthEvents>(
    consumer,
    {
        [AuthTopics.USER_CREATE]: async users => {
            const dtos: ProfileDto[] = users.map(user => {
                return {
                    _id: new Types.ObjectId(user.id),
                    username: user.username,
                    fullName: user.fullName
                }
            });

            await ProfileRepository.createProfiles(dtos);
        }
    }
);