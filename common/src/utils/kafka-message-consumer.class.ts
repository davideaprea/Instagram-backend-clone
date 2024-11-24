import { Consumer } from "kafkajs";
import { KafkaConsumer } from "./kafka-consumer.class";

export class KafkaMessageConsumer<T extends Record<string, {}>> extends KafkaConsumer {
    constructor(
        consumer: Consumer,
        private readonly eventHandlers: { [K in keyof T]: (message: T[K]) => Promise<void> }
    ) {
        super(consumer);
    }

    async connect(): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topics: Object.keys(this.eventHandlers)
        });
    }

    async run(): Promise<void> {
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (!message.value) return;

                const msg = this.parseMessage(message.value);

                this.eventHandlers[topic]?.(msg);
            },
        });
    }
}