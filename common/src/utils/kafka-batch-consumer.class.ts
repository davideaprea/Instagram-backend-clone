import { Consumer } from "kafkajs";
import { KafkaConsumer } from "./kafka-consumer.class";

export class KafkaBatchConsumer<T extends Record<string, {}>> extends KafkaConsumer {
    constructor(
        consumer: Consumer,
        private readonly eventHandlers: { [K in keyof T]: (messages: T[K][]) => Promise<void> }
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
            eachBatch: async ({ batch }) => {
                const messages = batch.messages
                    .filter(message => message.value)
                    .map(message => this.parseMessage(message.value!));

                this.eventHandlers[batch.topic]?.(messages);
            }
        });
    }
}