import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import request from "supertest";
import { app, baseRoute } from "../../src";
import { FollowModel } from "../../src/models/follow.model";
import { ProfileVisibility } from "../../../common/src/types/profile-visibility.enum";
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

describe(`POST ${baseRoute}/follows/:userId`, () => {
    it("should follow a user", async () => {
        const res = await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const follow = await FollowModel.findOne({
            userId: daveId,
            followingUserId: joeId,
            isAccepted: true
        });
        const follows: number = await FollowModel.countDocuments();
        const joeProfile = await ProfileModel.findOne({ _id: joeId }, { followers: 1 });

        expect(res.status).toBe(200);
        expect(follow).toBeDefined();
        expect(follows).toBe(1);
        expect(joeProfile!.followers).toBe(1);
    });

    it("should create a follow request because the profile is private", async () => {
        await ProfileModel.updateOne({ _id: joeId }, { "interactionRules.visibility": ProfileVisibility.PRIVATE });

        const res = await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const follow = await FollowModel.findOne({
            userId: daveId,
            followingUserId: joeId,
            isAccepted: false
        });
        const follows: number = await FollowModel.countDocuments();
        const joeProfile = await ProfileModel.findOne({ _id: joeId }, { followers: 1 });

        expect(res.status).toBe(200);
        expect(follow).toBeDefined();
        expect(follows).toBe(1);
        expect(joeProfile!.followers).toBe(0);
    });

    it("should stop a user from following a profile because it's been blocked", async () => {
        await BlockModel.create({ userId: joeId, blockedUserId: daveId });

        const res = await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const follows: number = await FollowModel.countDocuments();
        const joeProfile = await ProfileModel.findOne({ _id: joeId }, { followers: 1 });

        expect(res.status).toBe(404);
        expect(follows).toBe(0);
        expect(joeProfile!.followers).toBe(0);
    });
});

describe(`PATCH ${baseRoute}/follows/:userId`, () => {
    it("should accept a follow request", async () => {
        await ProfileModel.updateOne({ _id: joeId }, { "interactionRules.visibility": ProfileVisibility.PRIVATE });

        await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const res = await request(app)
            .patch(baseRoute + "/follows/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        const follow = await FollowModel.findOne({
            userId: daveId,
            followingUserId: joeId,
            isAccepted: true
        });

        const joeProfile = await ProfileModel.findOne({ _id: joeId }, { followers: 1, following: 1 });
        const daveProfile = await ProfileModel.findOne({ _id: daveId }, { followers: 1, following: 1 });

        expect(res.status).toBe(204);
        expect(follow).toBeDefined();
        expect(joeProfile!.followers).toBe(1);
        expect(daveProfile!.following).toBe(1);
    });
});

describe(`DELETE ${baseRoute}/follows/:userId`, () => {
    it("should unfollow a user", async () => {
        await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const res = await request(app)
            .delete(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const follows: number = await FollowModel.countDocuments();

        expect(res.status).toBe(204);
        expect(follows).toBe(0);
    });

    it("should return 404 because the follow is still a request", async () => {
        await ProfileModel.updateOne({ _id: joeId }, { "interactionRules.visibility": ProfileVisibility.PRIVATE });

        await request(app)
            .post(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const res = await request(app)
            .delete(baseRoute + "/follows/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        expect(res.status).toBe(404);
    })
});