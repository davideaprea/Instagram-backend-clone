import { Consumer } from "kafkajs";
import { AuthEvents, AuthTopics, KafkaConsumer } from "@ig-clone/common";
import { createProfile } from "../services/profile.service";
import { kafkaClient } from "../configs/kafka-client.config";

const consumer: Consumer = kafkaClient.consumer({
    groupId: "profile-group",
    sessionTimeout: 30000,
    allowAutoTopicCreation: false
});

export const authConsumer = new KafkaConsumer<AuthEvents>(
    consumer,
    {
        [AuthTopics.USER_CREATE]: createProfile
    }
);