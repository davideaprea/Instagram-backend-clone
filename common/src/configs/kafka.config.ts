import { Kafka, KafkaConfig } from "kafkajs";

const kafkaConfig: KafkaConfig = {
    clientId: 'service-client',
    brokers: ['kafka:9092']
};

export const kafka = new Kafka(kafkaConfig);