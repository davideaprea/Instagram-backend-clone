import { Consumer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { AuthTopics } from "@ig-clone/common";

export const initAuthConsumer = async (): Promise<void> => {
    const consumer: Consumer = kafka.consumer({ groupId: "profile-group" });

    await consumer.connect();
    await consumer.subscribe({ topic: AuthTopics.USER_CREATE, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            switch (topic) {
                case AuthTopics.USER_CREATE:
                    console.log(message.value)
                    break;
            }
        },
    });
}