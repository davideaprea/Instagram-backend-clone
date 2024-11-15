import { Kafka } from "kafkajs";

export const kafkaClient = new Kafka({
    clientId: 'profile',
    brokers: [process.env.LOCAL_KAFKA_URL!],
});