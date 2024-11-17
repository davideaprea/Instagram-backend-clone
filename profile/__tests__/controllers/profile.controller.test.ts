import { ProfileModel } from "../../src/models/profile.model";
import request from "supertest";
import { app, baseRoute } from "../../src";
import { ProfileDto } from "../../src/types/custom-types/profile-dto.type";
import { faker } from "@faker-js/faker";
import { FollowModel } from "../../src/models/follow.model";
import { createUser } from "../utils/create-user";

jest.mock("../../src/producers/profile.producer");

let joeToken: string;
let daveToken: string;
let joeId: string;
let daveId: string;

beforeEach(async () => {
    const joe = await createUser();
    const dave = await createUser();

    ({ id: joeId, token: joeToken } = joe);
    ({ id: daveId, token: daveToken } = dave);

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
                followingUserId: joeId
            };
        })
    );
});

describe(`GET ${baseRoute}/users/:username`, () => {
    it("should retrieve the user", async () => {
        const res = await request(app)
            .get(baseRoute + "/users/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        expect(res.status).toBe(200);
    });

    it("should't retrieve the user because the queried user has blocked the profile making the request", async () => {
        await request(app)
            .post(baseRoute + "/blocks/" + joeId)
            .set("Authorization", `Bearer ${daveToken}`);

        const res = await request(app)
            .get(baseRoute + "/users/" + daveId)
            .set("Authorization", `Bearer ${joeToken}`);

        expect(res.status).toBe(404);
    });
});

describe(`GET ${baseRoute}/users/:profileId/followers/:lastId`, () => {
    it("should get a page of profile followers", async () => {
        const res = await request(app)
            .get(`${baseRoute}/users/${joeId}/followers`)
            .set("Authorization", `Bearer ${joeToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(20);
    });
});

describe(`PATCH ${baseRoute}/users`, () => {
    it("should edit a user's profile", async () => {
        const res = await request(app)
            .patch(`${baseRoute}/users`)
            .set("Authorization", `Bearer ${joeToken}`)
            .send({
                username: "joey101",
                fullName: "Joey Johnson",
                biography: "Hi there!"
            });

        expect(res.status).toBe(204);
    });

    it("shouldn't edit a profile because of a bad request", async () => {
        const res = await request(app)
            .patch(`${baseRoute}/users`)
            .set("Authorization", `Bearer ${joeToken}`)
            .send({
                username: "joe/*__y101",
                fullName: "Joey John23424||/wason"
            });

        expect(res.status).toBe(400);
    });
});