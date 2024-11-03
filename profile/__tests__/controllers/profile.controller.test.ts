import { Schema, Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import request from "supertest";
import { app } from "../../src";

let currUserId: Schema.Types.ObjectId;
let queriedUserId: Schema.Types.ObjectId;
let currUserToken: string;
let queriedUserToken: string;

beforeEach(async () => {
    const currUser = await ProfileModel.create({
        username: "username",
        fullName: "full name",
        userId: new Types.ObjectId()
    });

    const queriedUser = await ProfileModel.create({
        username: "username2",
        fullName: "new full name",
        userId: new Types.ObjectId()
    });

    currUserId = currUser.userId;
    queriedUserId = queriedUser.userId;

    currUserToken = sign({ userId: currUserId }, process.env.JWT_SECRET!);
    queriedUserToken = sign({ userId: queriedUserId }, process.env.JWT_SECRET!);
});

describe("GET /users/:username", () => {
    it("should retrieve the user", async () => {
        const res = await request(app)
            .get("/users/username2")
            .set("Authorization", `Bearer ${currUserToken}`);
        
        expect(res.status).toBe(200);
    });

    it("should't retrieve the user because the queried user has blocked the profile making the request", async () => {
        await request(app)
            .post("/blocks/" + currUserId.toString())
            .set("Authorization", `Bearer ${queriedUserToken}`);

        const res = await request(app)
            .get("/users/username2")
            .set("Authorization", `Bearer ${currUserToken}`);

        expect(res.status).toBe(404);
    });
});