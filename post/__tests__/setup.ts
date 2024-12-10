import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { connect, connection, disconnect } from 'mongoose';

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create();
    const mongoUri = mongoServer.getUri();
    await connect(mongoUri);

    process.env.JWT_SECRET = "secret";
});

beforeEach(async () => {
    const collections = await connection.db?.collections() || [];

    for (const coll of collections) {
        await coll.deleteMany({});
    }
});

afterAll(async () => {
    await mongoServer?.stop();
    await disconnect();
});