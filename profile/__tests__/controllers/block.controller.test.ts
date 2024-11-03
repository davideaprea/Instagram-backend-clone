import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import { app } from "../../src";
import request from "supertest";

let token: string;
let newUserId: string;

describe("POST /blocks", () => {
    beforeAll(async () => {
        const currUser = await ProfileModel.create({
            username: "username",
            fullName: "full name",
            userId: new Types.ObjectId()
        });

        const newUserObjId = new Types.ObjectId();
        newUserId = newUserObjId.toString();

        await ProfileModel.create({
            username: "username2",
            fullName: "new full name",
            userId: newUserObjId
        });

        token = sign({ userId: currUser.userId }, process.env.JWT_SECRET!);
    });

    it("should block a user", async () => {
        const blockRes = await request(app)
            .post("/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get("/blocks")
            .set("Authorization", `Bearer ${token}`);

        expect(blockRes.status).toBe(204);
        expect(blockedUsersRes.status).toBe(200);
        expect(blockedUsersRes.body).toHaveLength(1);
    });
});