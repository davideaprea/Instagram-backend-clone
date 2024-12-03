import { Consumer } from "kafkajs";
import { AuthEvents, AuthTopics, KafkaBatchConsumer } from "@ig-clone/common";
import { kafkaClient } from "../configs/kafka-client.config";

const consumer: Consumer = kafkaClient.consumer({
    groupId: "post-group",
    sessionTimeout: 30000
});

export const authConsumer = new KafkaBatchConsumer<AuthEvents>(
    consumer,
    {
        [AuthTopics.USER_CREATE]: async users => {
        },
        [AuthTopics.USER_DELETE]: async ids => {
        }
    }
);