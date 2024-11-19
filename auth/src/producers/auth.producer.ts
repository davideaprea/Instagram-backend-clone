import { Producer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { AuthEvents, KafkaProducer } from "@ig-clone/common";

const producer: Producer = kafka.producer({
    allowAutoTopicCreation: false
});

export const authProducer = new KafkaProducer<AuthEvents>(producer);