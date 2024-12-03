import { kafkaClient } from "./kafka-client.config";

export const initKafkaTopics = async (): Promise<void> => {
    const admin = kafkaClient.admin();

    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: ,
                numPartitions: 1,
                replicationFactor: 1,
            },
        ],
    });
    await admin.disconnect();
}