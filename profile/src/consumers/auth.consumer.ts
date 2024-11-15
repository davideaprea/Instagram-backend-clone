import { Consumer } from "kafkajs";
import { AuthTopics } from "@ig-clone/common";
import { createProfile } from "../services/profile.service";
import { kafkaClient } from "../configs/kafka-client.config";

export const initAuthConsumer = async (): Promise<void> => {
    const consumer: Consumer = kafkaClient.consumer({
        groupId: "profile-group",
        sessionTimeout: 30000
    });

    await consumer.connect();
    await consumer.subscribe({ topic: AuthTopics.USER_CREATE, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if(!message.value) return;

            const stringMsgValue: string = message.value.toString();
            const jsonMsgValue = JSON.parse(stringMsgValue);

            console.log("Message received.", jsonMsgValue);

            switch (topic) {
                case AuthTopics.USER_CREATE:
                    await createProfile(jsonMsgValue);
                    break;
            }
        },
    });
}