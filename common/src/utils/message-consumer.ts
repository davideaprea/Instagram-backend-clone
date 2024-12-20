import { Consumer } from "kafkajs";

export const messageConsumer = async <T extends Record<string, {}>>(
    consumer: Consumer,
    eventHandlers: { [K in keyof T]: (message: T[K]) => Promise<void> }
): Promise<void> => {
    await consumer.subscribe({
        topics: Object.keys(eventHandlers)
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;

            const stringMsgValue: string = message.toString();
            const jsonMsgValue = JSON.parse(stringMsgValue);

            eventHandlers[topic]?.(jsonMsgValue);
        }
    });
}