import request from "supertest";
import { describe, test, expect, afterAll } from '@jest/globals';
import { app, server } from "../app"


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

    test("should respond with a 409 status code when email already exists", async () => {
        const response = await request(app).post("/users/register").send({
            "name": "James",
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: "This email is already in use" });
    });

    test("should respond with a 409 status code when name already exists", async () => {
        const response = await request(app).post("/users/register").send({
            "name": "Jaume",
            "email": "james@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ message: "This name is already in use" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).post("/users/register").send({
            "name": null,
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ message: "Invalid data format" });
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
        expect(response.body).toEqual({ message: "Invalid credentials" });
    });

    test("should respond with a 404 status code when user doesn`t exists", async () => {
        const response = await request(app).post("/users/login").send({
            "email": "joselito@email.com",
            "password": "pepito"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).post("/users/login").send({
            "email": "jaume@email.com"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ message: "Invalid format data" });
    });
});

