import { Types } from "mongoose";
import { ProfileModel } from "../../src/models/profile.model";
import request from "supertest";
import { app, baseRoute } from "../../src";
import { ProfileDto } from "../../src/types/custom-types/profile-dto.type";
import { faker } from "@faker-js/faker";
import { FollowModel } from "../../src/models/follow.model";
import { createUser } from "../utils/create-user";

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