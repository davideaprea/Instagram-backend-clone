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

    /* const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka-cluster-ip:9092'],
    });
    await kafka.producer().connect();
    console.log("Successully connected to the kafka broker."); */

    app.listen(
        3000,
        () => console.log(`Server running at http://localhost:${3000}.`)
    );
}

init();