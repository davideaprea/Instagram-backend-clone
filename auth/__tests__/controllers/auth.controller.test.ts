import request from "supertest";
import { app, baseRoute } from "../../src";

jest.mock("../../src/producers/auth.producer");

describe(`POST ${baseRoute}/register`, () => {
    it("registers a new user and returns just its username, full name and id with a status of 201", async () => {
        const res = await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "username",
                email: "email@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });
        
        const {username, fullName, id} = res.body;

        expect(res.status).toBe(201);
        expect(username).toBe("username");
        expect(fullName).toBe("Full Name");
        expect(id).toBeDefined();
    });

    it("should return a 400 status with every validation message", async () => {
        const res = await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "!^a",
                email: "emaimail.com",
                password: "pass24",
                fullName: "Full22 Name"
            });

        expect(res.status).toBe(400);
        console.log("RES",res.body)
        expect(res.body).toEqual({
            messages: [
                "Invalid username.",
                "Invalid name.",
                "Invalid email.",
                "Invalid password."
            ]
        });
    });

    it("should return 400 with error message for duplicate email", async () => {
        await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "username",
                email: "email@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });

        const res = await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "username",
                email: "email@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            messages: [
                "email@gmail.com is already taken."
            ]
        });
    });

    it("should return 400 with error message for duplicate username", async () => {
        await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "username",
                email: "email@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });

        const res = await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "username",
                email: "emaizl@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            messages: [
                "username is already taken."
            ]
        });
    });
});

describe(`POST ${baseRoute}/login`, () => {
    it("should log in the user", async () => {
        await request(app)
            .post(baseRoute + "/register")
            .send({
                username: "usrnm21",
                email: "myemail@gmail.com",
                password: "Password%2024",
                fullName: "Full Name"
            });

        const res = await request(app)
            .post(baseRoute + "/login")
            .send({
                email: "myemail@gmail.com",
                password: "Password%2024"
            });

        expect(res.status).toBe(200);
        expect(res.get("Authorization")).toBeDefined();
        expect(res.body).toEqual({
            username: "usrnm21",
            fullName: "Full Name"
        });

    });

    it("should return a 400 status with credentials not found message", async () => {
        const res = await request(app)
            .post(baseRoute + "/login")
            .send({
                email: "myemail@gmail.com",
                password: "Password%2024"
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ messages: [
            "Incorrect email or password."
        ] });
    });
});
