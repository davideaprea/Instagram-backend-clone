import { Producer } from "kafkajs";
import { kafka } from "../configs/kafka.config";
import { AuthEvents, KafkaProducer } from "@ig-clone/common";

const producer: Producer = kafka.producer();

export const authProducer = new KafkaProducer<AuthEvents>(producer);