import { Kafka } from "kafkajs";

export const kafkaClient = new Kafka({
    clientId: "post",
    brokers: [process.env.LOCAL_KAFKA_URL!],
});