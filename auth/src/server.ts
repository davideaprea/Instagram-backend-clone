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
        clientId: 'auth',
        brokers: ['kafka-service:9092'],
    });

    try {
        const admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
            topics: [
                {
                    topic: 'test-topic',
                    numPartitions: 1,
                    replicationFactor: 1,
                },
            ],
        });

        const producer = kafka.producer();
        await producer.connect()

        console.log("Successully connected to the kafka broker.");

        producer.send({
            topic: 'test-topic',
            messages: [
                { value: 'Hello microservices!' },
            ]
        });
    } catch (e) {
        console.log("Couldn't connect to kafka.", e);
    }

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();