import { Producer } from "kafkajs";
import { kafka } from "./kafka.config";

export const authProducer: Producer = kafka.producer();