import { ProfileTopics } from "@ig-clone/common";
import { Consumer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { UserModel } from "../models/user.model";

export const initProfileConsumer = async (): Promise<void> => {
    const consumer: Consumer = kafka.consumer({
        groupId: "auth-group",
        sessionTimeout: 30000
    });

    await consumer.connect();
    await consumer.subscribe({ topic: ProfileTopics.PROFILE_UPDATE, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;

            const stringMsgValue: string = message.value.toString();
            const jsonMsgValue = JSON.parse(stringMsgValue);

            console.log("Message received.", jsonMsgValue);

            switch (topic) {
                case ProfileTopics.PROFILE_UPDATE:
                    const { username, fullName, userId } = jsonMsgValue;

                    await UserModel.updateOne({ _id: userId }, { username, fullName });

                    break;
            }
        },
    });
}