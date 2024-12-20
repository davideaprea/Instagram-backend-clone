import { sign } from "jsonwebtoken";
import { UserModel } from "../../src/models/user.model";
import { Routes } from "../../src/types/routes.enum";
import { PostModel } from "../../src/models/post.model";
import { CommentService } from "../../src/services/comment.service";
import request from "supertest";
import { app } from "../../src";
import { CommentModel } from "../../src/models/comment.model";
import { ReplyService } from "../../src/services/reply.service";

const baseUrl: string = `${Routes.BASE}/${Routes.REPLIES}`;

let userId: string;
let token: string;
let postId: string;
let commentId: string;

beforeEach(async () => {
    const user = await UserModel.create({
        username: "username"
    });

    userId = user.id;
    token = sign({ userId: user.id }, process.env.JWT_SECRET!);

    const post = await PostModel.create({
        userId,
        medias: ["http//image.url.com"]
    });

    postId = post.id;

    const comment = await CommentService.create({
        content: {
            text: "",
            tags: [],
            hashtags: []
        },
        postId,
        userId: "507f1f77bcf86cd799439011"
    });

    commentId = comment.id;
});

describe(`POST ${baseUrl}`, () => {
    it("should create a comment reply", async () => {
        const res = await request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${token}`)
            .send({
                commentId,
                content: {
                    text: "Comment text"
                }
            });

        expect(res.status).toBe(201);
        expect((await CommentModel.findById(commentId))?.replies).toBe(1);
        expect((await PostModel.findById(postId))?.comments).toBe(2);
    });
});

describe(`DELETE ${baseUrl}`, () => {
    it("should delete a reply", async () => {
        const reply = await ReplyService.create({
            userId,
            commentId,
            content: {
                text: "Comment text",
                tags: [],
                hashtags: []
            }
        });

        const res = await request(app)
            .delete(`${baseUrl}/${reply._id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(204);
        expect((await CommentModel.findById(commentId))?.replies).toBe(0);
        expect((await PostModel.findById(postId))?.comments).toBe(1);
    });

    it("should block reply deletion because user doesn't own the resource", async () => {
        const reply = await ReplyService.create({
            userId: "507f1f77bcf86cd799439011",
            commentId,
            content: {
                text: "Comment text",
                tags: [],
                hashtags: []
            }
        });

        const res = await request(app)
            .delete(`${baseUrl}/${reply._id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(404);
        expect((await CommentModel.findById(commentId))?.replies).toBe(1);
        expect((await PostModel.findById(postId))?.comments).toBe(2);
    });
});