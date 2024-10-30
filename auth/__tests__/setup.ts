import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, disconnect } from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connect(mongoUri);

    process.env.JWT_SECRET = "secret";
});

beforeEach(async () => {
    const collections = await connection.db?.collections() || [];

    for(const coll of collections) {
        await coll.deleteMany({});
    }
});

afterAll(async () => {
    await mongoServer?.stop();
    await disconnect();
});