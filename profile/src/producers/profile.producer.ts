import { Producer } from "kafkajs";
import { kafka } from "../configs/kafka.config";

export const profileProducer: Producer = kafka.producer({
    allowAutoTopicCreation: false
});