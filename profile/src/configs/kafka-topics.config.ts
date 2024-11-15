import { ProfileTopics } from "@ig-clone/common";
import { kafkaClient } from "./kafka-client.config";

export const initKafkaTopics = async (): Promise<void> => {
    const admin = kafkaClient.admin();

    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: ProfileTopics.PROFILE_UPDATE,
                numPartitions: 1,
                replicationFactor: 1,
            },
        ],
    });
    await admin.disconnect();
}