import { KafkaProducer, PostEvents } from "@ig-clone/common";
import { Producer } from "kafkajs";
import { kafkaClient } from "../configs/kafka-client.config";

const producer: Producer = kafkaClient.producer();

export const postProducer = new KafkaProducer<PostEvents>(producer);