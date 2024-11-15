import { Producer } from "kafkajs";
import { kafkaClient } from "../configs/kafka-client.config";

export const profileProducer: Producer = kafkaClient.producer({
    allowAutoTopicCreation: false
});