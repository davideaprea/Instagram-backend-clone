import { Producer } from "kafkajs";
import { kafka } from "../configs/kafka.config";

export const authProducer: Producer = kafka.producer({
    allowAutoTopicCreation: false
});