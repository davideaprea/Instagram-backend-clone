import { AuthTopics } from "@ig-clone/common";
import { kafka } from "./kafka.config";

export const initKafkaTopics = async (): Promise<void> => {
    const admin = kafka.admin();

    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: AuthTopics.USER_CREATE,
                numPartitions: 1,
                replicationFactor: 1,
            },
        ],
    });
    await admin.disconnect();
}