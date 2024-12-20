import { messageConsumer, ProfileEvents, ProfileTopics } from "@ig-clone/common";
import { Consumer } from "kafkajs";
import { kafkaClient } from "../configs/kafka-client.config";

const consumer: Consumer = kafkaClient.consumer({
    groupId: "post-group",
    sessionTimeout: 30000
});

export const initProfileConsumer = async (): Promise<void> => {
    await consumer.connect();
    
    await messageConsumer<ProfileEvents>(
        consumer,
        {
            [ProfileTopics.PROFILE_UPDATE]: async msg => {
            }
        }
    );
}