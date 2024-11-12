import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import { app, baseRoute } from "../../src";
import request from "supertest";
import { BlockModel } from "../../src/models/block.model";
import { FollowModel } from "../../src/models/follow.model";
import { InteractionRuleModel } from "../../src/models/interaction-rule.model";

let token: string;
let newUserToken: string;
let currUserId: Types.ObjectId;
let newUserId: Types.ObjectId;

beforeEach(async () => {
    const currUser = await ProfileModel.create({
        username: "username",
        fullName: "full name"
    });

    const newUser = await ProfileModel.create({
        username: "username2",
        fullName: "new full name"
    });

    currUserId = currUser._id;
    newUserId = newUser._id;

    token = sign({ userId: currUserId }, process.env.JWT_SECRET!);
    newUserToken = sign({ userId: newUserId }, process.env.JWT_SECRET!);

    await InteractionRuleModel.create({ userId: currUser });
    await InteractionRuleModel.create({ userId: newUserId });
});

describe(`POST ${baseRoute}/blocks`, () => {
    it.skip("should block a user", async () => {
        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + newUserId.toString())
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get(baseRoute + "/blocks")
            .set("Authorization", `Bearer ${token}`);

        expect(blockRes.status).toBe(204);
        expect(blockedUsersRes.status).toBe(200);
        expect(blockedUsersRes.body).toHaveLength(1);
    });

    it("should block and unfollow a user", async () => {
        await request(app)
            .post(baseRoute + "/follows/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + currUserId)
            .set("Authorization", `Bearer ${newUserToken}`);

        const block = await BlockModel.findOne({ userId: newUserId, blockedUserId: currUserId });
        const follow: number = await FollowModel.countDocuments();
        const userBlockCreator = (await ProfileModel.findOne({ _id: newUserId }))!
        const blockedUser = (await ProfileModel.findOne({ _id: currUserId }))!;

        expect(follow).toBe(0);
        expect(blockRes.status).toBe(204);
        expect(block).toBeDefined();
        expect(blockedUser.following).toBe(0);
        expect(userBlockCreator.followers).toBe(0);
    });

    it.skip("should block a user and remove each others follow", async () => {
        await request(app)
            .post(baseRoute + "/follows/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post(baseRoute + "/follows/" + currUserId)
            .set("Authorization", `Bearer ${newUserToken}`);

        const blockRes = await request(app)
            .post(baseRoute + "/blocks/" + currUserId)
            .set("Authorization", `Bearer ${newUserToken}`);

        const block = await BlockModel.findOne({ userId: newUserId, blockedUserId: currUserId });
        const follow: number = await FollowModel.countDocuments();
        const userBlockCreator = (await ProfileModel.findOne({ _id: newUserId }))!
        const blockedUser = (await ProfileModel.findOne({ _id: currUserId }))!;

        expect(follow).toBe(0);
        expect(blockRes.status).toBe(204);
        expect(block).toBeDefined();
        expect(blockedUser.following).toBe(0);
        expect(userBlockCreator.followers).toBe(0);
    });

    it.skip("should give a 400 because the user can't block himself", async () => {
        const res = await request(app)
            .post(baseRoute + "/blocks/" + currUserId.toString())
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
    });
});

describe.skip(`DELETE ${baseRoute}/blocks`, () => {
    it("should unblock a user", async () => {
        await request(app)
            .post(baseRoute + "/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const unblockRes = await request(app)
            .delete(baseRoute + "/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        const blockedUsersRes = await request(app)
            .get(baseRoute + "/blocks")
            .set("Authorization", `Bearer ${token}`);

        expect(unblockRes.status).toBe(204);
        expect(blockedUsersRes.body).toHaveLength(0);
    });

    it("should return 404 status", async () => {
        const unblockRes = await request(app)
            .delete(baseRoute + "/blocks/" + newUserId)
            .set("Authorization", `Bearer ${token}`);

        expect(unblockRes.status).toBe(404);
    });
});