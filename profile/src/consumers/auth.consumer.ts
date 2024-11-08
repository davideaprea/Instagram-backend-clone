import { Consumer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { AuthTopics } from "@ig-clone/common";

export const initAuthConsumer = async (): Promise<void> => {
    const consumer: Consumer = kafka.consumer({ groupId: "profile-group" });

    await consumer.connect();
    await consumer.subscribe({ topic: AuthTopics.USER_CREATE, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if(!message.value) return;

            const stringMsg: string = message.value.toString();
            const jsonMsg = JSON.parse(stringMsg);

            console.log("Message received.", jsonMsg);

            switch (topic) {
                case AuthTopics.USER_CREATE:
                    break;
            }
        },
    });
}