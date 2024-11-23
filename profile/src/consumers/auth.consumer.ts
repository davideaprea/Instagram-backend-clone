import { Consumer } from "kafkajs";
import { AuthEvents, AuthTopics, KafkaConsumer } from "@ig-clone/common";
import { kafkaClient } from "../configs/kafka-client.config";
import { ProfileService } from "../services/profile.service";

const consumer: Consumer = kafkaClient.consumer({
    groupId: "profile-group",
    sessionTimeout: 30000,
    allowAutoTopicCreation: false
});

export const authConsumer = new KafkaConsumer<AuthEvents>(
    consumer,
    {
        [AuthTopics.USER_CREATE]: ProfileService.createProfile
    }
);