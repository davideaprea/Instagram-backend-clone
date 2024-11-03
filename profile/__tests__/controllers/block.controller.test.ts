import { Schema, Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import { app } from "../../src";
import request from "supertest";

let token: string;
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

    token = sign({ userId: currUser.userId }, process.env.JWT_SECRET!);
});

describe("POST /blocks", () => {
    it("should block a user", async () => {
        const blockRes = await request(app)
            .post("/blocks/" + newUserId.toString())
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get("/blocks")
            .set("Authorization", `Bearer ${token}`);

        expect(blockRes.status).toBe(204);
        expect(blockedUsersRes.status).toBe(200);
        expect(blockedUsersRes.body).toHaveLength(1);
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