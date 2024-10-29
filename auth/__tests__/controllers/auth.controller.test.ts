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