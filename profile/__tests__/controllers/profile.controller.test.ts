import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import { sign } from "jsonwebtoken";
import request from "supertest";
import { app, baseRoute } from "../../src";
import { ProfileDto } from "../../src/types/custom-types/profile-dto.type";
import { faker } from "@faker-js/faker";
import { FollowModel } from "../../src/models/follow.model";

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

    const profileDtos: ProfileDto[] = [];

    for (let i = 0; i < 100; i++) {
        profileDtos.push({
            username: faker.internet.username(),
            fullName: faker.person.fullName()
        });
    }

    await ProfileModel.create(profileDtos);

    const profiles = await ProfileModel.find();

    await FollowModel.create(
        profiles.map(profile => {
            return {
                userId: profile._id,
                followingUserId: currUserId
            };
        })
    );
});

describe(`GET ${baseRoute}/users/:username`, () => {
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

describe(`GET ${baseRoute}/users/:profileId/followers/:lastId`, () => {
    it("should get a page of profile followers", async () => {
        const res = await request(app)
        .get(`${baseRoute}/users/${currUserId}/followers`)
        .set("Authorization", `Bearer ${currUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(20);
    });
});