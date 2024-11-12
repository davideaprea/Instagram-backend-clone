import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'profile',
    brokers: [process.env.LOCAL_KAFKA_URL!],
});