import { sign } from "jsonwebtoken";
import { UserModel } from "../../src/models/user.model";
import { PostModel } from "../../src/models/post.model";
import { Routes } from "../../src/types/routes.enum";
import request from "supertest";
import { app } from "../../src";
import { CommentModel } from "../../src/models/comment.model";
import { CommentService } from "../../src/services/comment.service";

const baseUrl: string = `${Routes.BASE}/${Routes.COMMENTS}`;

let userId: string;
let token: string;
let postId: string;

beforeEach(async () => {
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

describe.skip(`POST ${baseUrl}`, () => {
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

describe.skip(`DELETE ${baseUrl}/:id`, () => {
    it("should delete a comment", async () => {
        const createRes = await request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${token}`)
            .send({
                postId,
                content: {
                    text: "Comment text"
                }
            });

        const deleteRes = await request(app)
            .delete(`${baseUrl}/${createRes.body._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(204);
        expect(await CommentModel.countDocuments()).toBe(0);
        expect((await PostModel.findById(postId))?.comments).toBe(0);
    });

    it("should block comment deletion because user doesn't own the resource", async () => {
        const comment = await CommentService.create({
            content: {
                text: "",
                tags: [],
                hashtags: []
            },
            postId,
            userId: "507f1f77bcf86cd799439011"
        });

        const deleteRes = await request(app)
            .delete(`${baseUrl}/${comment._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(404);
        expect(await CommentModel.countDocuments()).toBe(1);
        expect((await PostModel.findById(postId))?.comments).toBe(1);
    });
});