import { sign } from "jsonwebtoken";
import { UserModel } from "../../src/models/user.model";
import { app } from "../../src";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { PostModel } from "../../src/models/post.model";
import { Types } from "mongoose";
import { Routes } from "../../src/types/routes.enum";

jest.mock("../../src/producers/post.producer");
jest.mock('@ig-clone/common', () => {
    return {
        ...jest.requireActual('@ig-clone/common'),
        saveFile: jest.fn(() => Promise.resolve("http//image.url.com")),
        deleteFile: jest.fn()
    };
});

let userId: string;
let token: string;

beforeEach(async () => {
    jest.clearAllMocks();

    const user = await UserModel.create({
        username: "username"
    });

    token = sign({ userId: user.id }, process.env.JWT_SECRET!);
    userId = user.id;
});

describe.skip(`POST ${Routes.BASE}`, () => {
    it("should create a post", async () => {
        const res = await request(app)
            .post(Routes.BASE)
            .set("Authorization", `Bearer ${token}`)
            .field("caption[text]", "Caption")
            .field("caption[hashtags][0]", "hashtag1")
            .field("caption[hashtags][1]", "hashtag2")
            .field("caption[tags][0]", "507f1f77bcf86cd799439011")
            .field("pinned", true)
            .attach("medias", Buffer.from("Image", "utf-8"), "img.jpeg")
            .attach("medias", Buffer.from("Video", "utf-8"), "video.jpeg")

        expect(res.status).toBe(201);
    });

    it("should block post creation, with 404 status code", async () => {
        const res = await request(app)
            .post(Routes.BASE)
            .set("Authorization", `Bearer ${token}`)
            .field("caption[text]", faker.string.alphanumeric(501))
            .field("caption[hashtags][0]", "hashtag1")
            .field("caption[hashtags][1]", "hashtag2")
            .field("caption[tags][0]", "507f1f77bcf86cd799439011")
            .field("pinned", "asdf")

        expect(res.status).toBe(400);
    });
});

describe.skip(`DELETE ${Routes.BASE}/:id`, () => {
    it("should delete a post", async () => {
        const post = await PostModel.create({
            userId,
            medias: ["http//image.url.com"]
        });

        const res = await request(app)
            .delete(`${Routes.BASE}/${post.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
        expect(await PostModel.findById(post.id)).toBeNull();
    });

    it("should block post deletion because user doesn't own the resource", async () => {
        const post = await PostModel.create({
            userId: new Types.ObjectId(),
            medias: ["http//image.url.com"]
        });

        const res = await request(app)
            .delete(`${Routes.BASE}/${post.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(await PostModel.findById(post.id)).toBeDefined();
    });
});