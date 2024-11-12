import request from "supertest";
import { describe, test, expect, afterAll, beforeEach, beforeAll } from '@jest/globals';
//const { app, server } = require("../app");
import { app, server } from "../app"

let token: string;
let userId: string;
let token2: string;
let userId2: string;
beforeEach(async() => {
    const response = await request(app).post("/users/login").send({
        "email": "jaume@email.com",
        "password": "jaume"
    });

    token = response.body.token
    userId = response.body.id

    const response2 = await request(app).post("/users/login").send({
        "email": "pepito@email.com",
        "password": "pepito"
    });

    token2 = response2.body.token
    userId2 = response2.body.id
});

afterAll(() => {
    server.close();
});

describe("POST/users/register", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).post("/users/register").send({
            "name": "Jaume",
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.role).toEqual("admin");
    });

    test("should respond with role='simpleUser' when creates another user", async () => {
        const response = await request(app).post("/users/register").send({
            "name": "Pepito",
            "email": "pepito@email.com",
            "password": "pepito"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.role).toEqual("simpleUser");
    });

    test("should respond with a 409 status code when user already exists", async () => {
        const response = await request(app).post("/users/register").send({
            "name": "Jaume",
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ error: "User already exists" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).post("/users/register").send({
            "name": null,
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Invalid data format" });
    });
});

describe("POST/users/login", () => {
    test("should respond with a 200 status code when loggin is succesfull", async () => {
        const response: any = await request(app).post("/users/login").send({
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("should respond with a 401 status code when credentials are invalid", async () => {
        const response = await request(app).post("/users/login").send({
            "email": "jaume@email.com",
            "password": "pepito"
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "Invalid credentials" });
    });

    test("should respond with a 404 status code when user doesn`t exists", async () => {
        const response = await request(app).post("/users/login").send({
            "email": "joselito@email.com",
            "password": "pepito"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).post("/users/login").send({
            "email": "jaume@email.com"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Invalid format data" });
    });
});

describe("PUT/users/:userId", () => {
    test("should respond with a 200 status code when data is succesfully updated", async () => {
        const response = await request(app).put(`/users/${userId}`).set("Authorization", `Bearer ${token}`).send({
            "name": "James",
            "email": "jaume@email.com",
            "password": "jaume"
        })
                                                     
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual("James");
    });

    test("should respond with a 401 status code when user isn`t authorized", async () => {
        const response = await request(app).put(`/users/${userId}`).send({
            "name" : "Jaume"
        })                                               
        expect(response.statusCode).toBe(401);
    });

    test("should respond with a 404 status code when user doesn't exist", async () => {
        const response = await request(app).put(`/users/xxxx`).set("Authorization", `Bearer ${token}`).send({
            "name": "James",
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).put(`/users/${userId}`).set("Authorization", `Bearer ${token}`).send({
            "name": null,
            "email": "jaume@email.com",
            "password": "jaume"
        })                                             
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({error: "Invalid data format"})
    });
})

describe("DELETE/users/:userId", () => {
    test("should respond with a 200 status code when user is deleted succesfully", async () => {
        const response = await request(app).delete(`/users/${userId2}`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("User deleted")
    });

    test("should respond with a 401 status code when user isn`t authorized", async () => {
        const response = await request(app).delete(`/users/${userId}`).send();                                              
        expect(response.statusCode).toBe(401);
    });

    test("should respond with a 404 status code when user is not found", async () => {
        const response = await request(app).delete(`/users/xxx`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" })
    });
})