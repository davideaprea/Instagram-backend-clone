import request from "supertest";
import { app } from "../../src";

it("registers a new user and returns just its username and full name, with a status of 201", async () => {
    const res = await request(app)
        .post("/register")
        .send({
            username: "username",
            email: "email@gmail.com",
            password: "Password%2024",
            fullName: "Full Name"
        });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
        username: "username",
        fullName: "Full Name"
    });
});

it("should return a 400 status with every validation message", async () => {
    const res = await request(app)
        .post("/register")
        .send({
            username: "!^a",
            email: "emaimail.com",
            password: "pass24",
            fullName: "Full22 Name"
        });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
        messages: [
            "The given email is not valid.",
            "The username is not valid.",
            "Password must be at least 8 characters long, include a number, a special character, an uppercase character and a lowercase character.",
            "The name is not valid."
        ]
    });
});

it("should return 400 with error message for duplicate email", async () => {
    const res = await request(app)
        .post("/register")
        .send({
            username: "username",
            email: "email@gmail.com",
            password: "Password%2024",
            fullName: "Full Name"
        });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ messages: [
        "email@gmail.com is already taken."
    ] });
});

it("should return 400 with error message for duplicate username", async () => {
    const res = await request(app)
        .post("/register")
        .send({
            username: "username",
            email: "emaizl@gmail.com",
            password: "Password%2024",
            fullName: "Full Name"
        });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ messages: [
        "username is already taken."
    ] });
});