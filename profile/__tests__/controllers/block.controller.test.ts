import { ProfileModel } from "../../src/models/profile.model";
import { app, baseRoute } from "../../src";
import request from "supertest";
import { FollowModel } from "../../src/models/follow.model";
import { createUser } from "../utils/create-user";
import { BlockModel } from "@ig-clone/common";

let joeToken: string;
let daveToken: string;
let joeId: string;
let daveId: string;

beforeEach(async () => {
    const joe = await createUser();
    const dave = await createUser();

    ({ id: joeId, token: joeToken } = joe);
    ({ id: daveId, token: daveToken } = dave);
});

describe(`POST ${baseRoute}/blocks`, () => {
    it("should block a user", async () => {
        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        const blockedUsersRes = await request(app)
            .get(baseRoute + "/blocks")
            .set("Authorization", `Bearer ${joeToken}`);

        expect(blockRes.status).toBe(204);
        expect(blockedUsersRes.status).toBe(200);
        expect(blockedUsersRes.body).toHaveLength(1);
    });

    it("should block and unfollow a user", async () => {
        await request(app)
            .post(baseRoute + "/follows/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const block = await BlockModel.findOne({ userId: daveId, blockedUserId: joeId });
        const follow: number = await FollowModel.countDocuments();
        const userBlockCreator = (await ProfileModel.findOne({ _id: daveId }))!
        const blockedUser = (await ProfileModel.findOne({ _id: joeId }))!;

        expect(follow).toBe(0);
        expect(blockRes.status).toBe(204);
        expect(block).toBeDefined();
        expect(blockedUser.following).toBe(0);
        expect(userBlockCreator.followers).toBe(0);
    });

    it("should block a user and remove each others follow", async () => {
        await request(app)
            .post(baseRoute + "/follows/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const block = await BlockModel.findOne({ userId: daveId, blockedUserId: joeId });
        const follow: number = await FollowModel.countDocuments();
        const userBlockCreator = (await ProfileModel.findOne({ _id: daveId }))!
        const blockedUser = (await ProfileModel.findOne({ _id: joeId }))!;

        expect(follow).toBe(0);
        expect(blockRes.status).toBe(204);
        expect(block).toBeDefined();
        expect(blockedUser.following).toBe(0);
        expect(userBlockCreator.followers).toBe(0);
    });

    it("should give a 400 because the user can't block himself", async () => {
        const res = await request(app)
            .post(baseRoute + "/blocks/" + joeId)
            .set("Authorization", `Bearer ${joeToken}`);

        expect(res.status).toBe(400);
    });
});

describe(`DELETE ${baseRoute}/blocks`, () => {
    it("should unblock a user", async () => {
        await request(app)
            .post(baseRoute + "/blocks/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        const unblockRes = await request(app)
            .delete(baseRoute + "/blocks/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        const blockedUsersRes = await request(app)
            .get(baseRoute + "/blocks")
            .set("Authorization", `Bearer ${joeToken}`);

        expect(unblockRes.status).toBe(204);
        expect(blockedUsersRes.body).toHaveLength(0);
    });

    it("should return 404 status", async () => {
        const unblockRes = await request(app)
            .delete(baseRoute + "/blocks/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        expect(unblockRes.status).toBe(404);
    });
});