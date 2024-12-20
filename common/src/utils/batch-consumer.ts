import { Consumer } from "kafkajs";

export const batchConsumer = async <T extends Record<string, {}>>(
    consumer: Consumer,
    eventHandlers: { [K in keyof T]: (messages: T[K][]) => Promise<void> }
): Promise<void> => {
    await consumer.subscribe({
        topics: Object.keys(eventHandlers)
    });

    await consumer.run({
        eachBatch: async ({ batch }) => {
            const messages = batch.messages
                .filter(message => message.value)
                .map(message => {
                    const stringMsgValue: string = message.toString();
                    return JSON.parse(stringMsgValue);
                });

            eventHandlers[batch.topic]?.(messages);
        }
    });
}