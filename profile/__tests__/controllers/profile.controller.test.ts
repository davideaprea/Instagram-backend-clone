import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import request from "supertest";
import { app, baseRoute } from "../../src";

let currUserId: Types.ObjectId;
let queriedUserId: Types.ObjectId;
let currUserToken: string;
let queriedUserToken: string;

beforeEach(async () => {
    const currUser = await ProfileModel.create({
        username: "username",
        fullName: "full name"
    });

    const queriedUser = await ProfileModel.create({
        username: "username2",
        fullName: "new full name"
    });

    currUserId = currUser._id;
    queriedUserId = queriedUser._id;

    currUserToken = sign({ userId: currUserId }, process.env.JWT_SECRET!);
    queriedUserToken = sign({ userId: queriedUserId }, process.env.JWT_SECRET!);
});

describe.skip(`GET ${baseRoute}/users/:username`, () => {
    it("should retrieve the user", async () => {
        const res = await request(app)
            .get(baseRoute + "/users/username2")
            .set("Authorization", `Bearer ${currUserToken}`);
        
        expect(res.status).toBe(200);
    });

    it("should't retrieve the user because the queried user has blocked the profile making the request", async () => {
        await request(app)
            .post(baseRoute + "/blocks/" + currUserId.toString())
            .set("Authorization", `Bearer ${queriedUserToken}`);

        const res = await request(app)
            .get(baseRoute + "/users/username2")
            .set("Authorization", `Bearer ${currUserToken}`);

        expect(res.status).toBe(404);
    });
});