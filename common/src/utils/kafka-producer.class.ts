import { Producer } from "kafkajs";

export class KafkaProducer<T extends Record<string, {}>> {
    constructor(private readonly producer: Producer) { }

    async sendMsg<K extends Extract<keyof T, string>>(topic: K, msg: T[K]): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(msg) }]
        });
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }
}