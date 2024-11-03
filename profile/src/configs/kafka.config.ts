import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'auth',
    brokers: [process.env.LOCAL_KAFKA_URL!],
});