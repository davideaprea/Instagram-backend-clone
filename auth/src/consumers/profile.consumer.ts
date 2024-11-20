import { KafkaConsumer, ProfileEvents, ProfileTopics } from "@ig-clone/common";
import { Consumer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { UserModel } from "../models/user.model";

const consumer: Consumer = kafka.consumer({
    groupId: "auth-group",
    sessionTimeout: 30000,
    allowAutoTopicCreation: false
});

export const profileConsumer = new KafkaConsumer<ProfileEvents>(
    consumer,
    {
        [ProfileTopics.PROFILE_UPDATE]: async msg => {
            const {id, ...editDto} = msg;

            await UserModel.updateOne({ _id: msg.id }, editDto);
        }
    }
);