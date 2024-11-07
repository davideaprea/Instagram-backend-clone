import { Schema, Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import { app } from "../../src";
import request from "supertest";
import { BlockModel } from "../../src/models/block.model";
import { FollowModel } from "../../src/models/follow.model";

let token: string;
let newUserToken: string;
let currUserId: Schema.Types.ObjectId;
let newUserId: Schema.Types.ObjectId;

beforeEach(async () => {
    const currUser = await ProfileModel.create({
        username: "username",
        fullName: "full name",
        userId: new Types.ObjectId()
    });

    const newUser = await ProfileModel.create({
        username: "username2",
        fullName: "new full name",
        userId: new Types.ObjectId()
    });

    currUserId = currUser.userId;
    newUserId = newUser.userId;

    token = sign({ userId: currUserId }, process.env.JWT_SECRET!);
    newUserToken = sign({ userId: newUserId }, process.env.JWT_SECRET!)
});

describe("POST /blocks", () => {
    it("should block a user", async () => {
        const blockRes = await request(app)
            .post("/blocks/" + newUserId.toString())
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get("/blocks")
            .set("Authorization", `Bearer ${token}`);

        console.log(currUserId, newUserId);
        console.log(await BlockModel.find())

        expect(blockRes.status).toBe(204);
        expect(blockedUsersRes.status).toBe(200);
        expect(blockedUsersRes.body).toHaveLength(1);
    });

    it("should block and unfollow a user", async () => {
        await request(app)
            .post("/follows/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const blockRes = await request(app)
            .post("/blocks/" + currUserId)
            .set("Authorization", `Bearer ${newUserToken}`);

        const block = await BlockModel.findOne({ userId: newUserId, blockedUserId: currUserId });
        const follow: number = await FollowModel.countDocuments();
        const userBlockCreator = (await ProfileModel.findOne({ userId: newUserId }))!
        const blockedUser = (await ProfileModel.findOne({ userId: currUserId }))!;

        expect(follow).toBe(0);
        expect(blockRes.status).toBe(204);
        expect(block).toBeDefined();
        expect(blockedUser.following).toBe(0);
        expect(userBlockCreator.followers).toBe(0);
    });

    it("should give a 400 because the user can't block himself", async () => {
        const res = await request(app)
            .post("/blocks/" + currUserId.toString())
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
    });
});

describe("DELETE /blocks", () => {
    it("should unblock a user", async () => {
        await request(app)
            .post("/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const unblockRes = await request(app)
            .delete("/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get("/blocks")
            .set("Authorization", `Bearer ${token}`);

        expect(unblockRes.status).toBe(204);
        expect(blockedUsersRes.body).toHaveLength(0);
    });

    it("should return 404 status", async () => {
        const unblockRes = await request(app)
            .delete("/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        expect(unblockRes.status).toBe(404);
    });
});