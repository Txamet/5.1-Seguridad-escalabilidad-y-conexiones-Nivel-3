import request from "supertest";
import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
import { app, server } from "../app"

let token: string;
let userId: string;
let token2: string;
let userId2: string;
let userId3: string;

beforeAll(async() => {
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

describe("PUT/users/:userId", () => {
    test("should respond with a 200 status code when data is succesfully updated", async () => {
        const response = await request(app).put(`/users/${userId}`).set("Authorization", `Bearer ${token}`).send({
            "name": "James",
            "email": "jaume@email.com"    
        })
                                                     
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual("James");
    });

    test("should respond with a 401 status code when token is missing", async () => {
        const response = await request(app).put(`/users/${userId}`).send({
            "name" : "Jaume"
        })                                               
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 404 status code when user doesn't exist", async () => {
        const response = await request(app).put(`/users/xxxx`).set("Authorization", `Bearer ${token}`).send({
            "name": "James",
            "email": "jaume@email.com",
            "password": "jaume"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).put(`/users/${userId}`).set("Authorization", `Bearer ${token}`).send({
            "name": null,
            "email": "jaume@email.com",
            "password": "jaume"
        })                                             
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({message: "Invalid data format"})
    });
})

describe("DELETE/users/:userId", () => {
    test("should respond with a 200 status code when user is deleted succesfully", async () => {
        const response = await request(app).delete(`/users/${userId2}`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "User deleted"})
    });

    test("should respond with a 401 status code when token is missing", async () => {
        const response = await request(app).delete(`/users/${userId2}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 403 status code when user is not admin", async () => {
        const response = await request(app).delete(`/users/${userId}`).set("Authorization", `Bearer ${token2}`).send();                                              
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: "Access denied, admin only" });
    });

    test("should respond with a 404 status code when user is not found", async () => {
        const response = await request(app).delete(`/users/xxx`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User not found" })
    });
});

describe("PATCH/users/:userId/recover", () => {
    test("should respond with a 200 status code when user is recovered succesfully", async () => {
        const response = await request(app).patch(`/users/${userId2}/recover`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "User recovered"})
    });

    test("should respond with a 401 status code when token is missing", async () => {
        const response = await request(app).patch(`/users/${userId2}/recover`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 403 status code when user is not admin", async () => {
        const response = await request(app).patch(`/users/${userId2}/recover`).set("Authorization", `Bearer ${token2}`).send();                                              
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: "Access denied, admin only" });
    });

    test("should respond with a 404 status code when user is not found", async () => {
        const response = await request(app).patch(`/users/xxx/recover`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User not found" })
    });

    test("should respond with a 409 status is user already exists with another userId", async () => {
        const deletedUser = await request(app).delete(`/users/${userId2}`).set("Authorization", `Bearer ${token}`).send();
        const createUser = await request(app).post("/users/register").send({
            "name": "Pepito",
            "email": "pepito@email.com",
            "password": "pepito"
        });
        const loginUser = await request(app).post("/users/login").send({
            "email": "pepito@email.com",
            "password": "pepito"
        });
        userId3 = loginUser.body.id

        const response = await request(app).patch(`/users/${userId2}/recover`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({message: "User already exists with another userId"})
    });
});

describe("GET/users", () => {
    test("should respond with a 200 status code when users list is displayed succesfully", async () => {
        const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(3);
    });

    test("should respond with a 401 status code when token is missing", async () => {
        const response = await request(app).get("/users").send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 403 status code when user is not admin", async () => {
        const response = await request(app).get("/users").set("Authorization", `Bearer ${token2}`).send();                                              
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: "Access denied, admin only" });
    });
});

describe("GET/users/:userId", () => {
    test("should respond with a 200 status code when user is displayed succesfully", async () => {
        const response = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${token}`).send();
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.email).toEqual("jaume@email.com");
    });

    test("should respond with a 401 status code when token is missing", async () => {
        const response = await request(app).get(`/users/${userId}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });
});