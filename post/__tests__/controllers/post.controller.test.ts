import { sign } from "jsonwebtoken";
import { UserModel } from "../../src/models/user.model";
import { app, baseRoute } from "../../src";
import request from "supertest";

jest.mock("../../src/producers/post.producer");
jest.mock('@ig-clone/common', () => {
    return {
        ...jest.requireActual('@ig-clone/common'),
        saveFile: jest.fn(() => Promise.resolve("http//image.url.com"))
    };
});

let token: string;

beforeEach(async () => {
    jest.clearAllMocks();

    const user = await UserModel.create({
        username: "username"
    });

    token = sign({ userId: user.id }, process.env.JWT_SECRET!);
});

describe(`POST ${baseRoute}`, () => {
    it("should create a post", async () => {
        const res = await request(app)
            .post(baseRoute)
            .set("Authorization", `Bearer ${token}`)
            .field({
                "caption.text": "Caption"
            })
            .attach("medias", Buffer.from("Image", "utf-8"), "img.jpeg")
            .attach("medias", Buffer.from("Video", "utf-8"), "video.jpeg")

        expect(res.status).toBe(201);
    });
});