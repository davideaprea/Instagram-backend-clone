import { Producer } from "kafkajs";
import { kafkaClient } from "../configs/kafka-client.config";
import { KafkaProducer, ProfileEvents } from "@ig-clone/common";

export const producer: Producer = kafkaClient.producer();

export const profileProducer = new KafkaProducer<ProfileEvents>(producer);