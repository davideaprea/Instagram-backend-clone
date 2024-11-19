import { Consumer } from "kafkajs";

export class KafkaConsumer<T extends Record<string, {}>> {
    constructor(
        private readonly consumer: Consumer,
        private readonly eventHandlers: { [K in keyof T]: (msg: T[K]) => void | Promise<void> }
    ) { }

    async connect(): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topics: Object.keys(this.eventHandlers),
            fromBeginning: true
        });
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if(!message.value) return;
    
                const stringMsgValue: string = message.value.toString();
                const jsonMsgValue = JSON.parse(stringMsgValue);
    
                this.eventHandlers[topic]?.(jsonMsgValue);
            },
        });
    }
}