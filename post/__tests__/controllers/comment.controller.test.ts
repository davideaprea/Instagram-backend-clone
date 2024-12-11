import { sign } from "jsonwebtoken";
import { UserModel } from "../../src/models/user.model";
import { PostModel } from "../../src/models/post.model";
import { Routes } from "../../src/types/routes.enum";
import request from "supertest";
import { app } from "../../src";
import { CommentModel } from "../../src/models/comment.model";

const baseUrl: string = `${Routes.BASE}/${Routes.COMMENTS}`;

let userId: string;
let token: string;
let postId: string;

beforeEach(async () => {
    jest.clearAllMocks();

    const user = await UserModel.create({
        username: "username"
    });

    token = sign({ userId: user.id }, process.env.JWT_SECRET!);
    userId = user.id;

    const post = await PostModel.create({
        userId,
        medias: ["http//image.url.com"]
    });

    postId = post.id;
});

describe(`POST ${baseUrl}`, () => {
    it("should create a comment", async () => {
        const res = await request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${token}`)
            .send({
                postId,
                content: {
                    text: "Comment text"
                }
            });

        expect(res.status).toBe(200);
        expect(await CommentModel.countDocuments()).toBe(1);
        expect((await PostModel.findById(postId))?.comments).toBe(1);
    });

    it("should block the user from creating a comment", async () => {
        const res = await request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: {
                    hashtags: ["hashtag"]
                }
            });

        expect(await CommentModel.countDocuments()).toBe(0);
        expect((await PostModel.findById(postId))?.comments).toBe(0);
        expect(res.status).toBe(400);
    });
});