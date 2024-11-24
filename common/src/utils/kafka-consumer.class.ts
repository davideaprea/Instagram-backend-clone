import { Consumer } from "kafkajs";

export abstract class KafkaConsumer {
    constructor(
        protected readonly consumer: Consumer
    ) { }

    protected parseMessage(message: Buffer) {
        const stringMsgValue: string = message.toString();
        const jsonMsgValue = JSON.parse(stringMsgValue);
        return jsonMsgValue;
    }

    abstract connect(): Promise<void>;

    abstract run(): Promise<void>;
}