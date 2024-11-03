import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import { app } from "../../src";
import request from "supertest";

let token: string;
let currUserId: Types.ObjectId;
let newUserId: Types.ObjectId;

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

    currUserId = currUser._id;
    newUserId = newUser._id;

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