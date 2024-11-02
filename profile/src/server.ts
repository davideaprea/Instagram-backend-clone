import { connect } from "mongoose";
import { app } from ".";
import { Kafka } from "kafkajs";

const init = async (): Promise<void> => {
    try {
        await connect(process.env.LOCAL_DB_URL!);
        console.log("Successully connected to the database.");
    } catch (e) {
        console.log("Couldn't connect to the database.", e);
    }

    const kafka = new Kafka({
        clientId: 'profile',
        brokers: ['kafka-service:9092'],
    });
    const consumer = kafka.consumer({ groupId: "profile-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value?.toString()}`);
        },
    });

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();