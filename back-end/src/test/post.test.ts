import request from "supertest";
import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
import { app, server } from "../app"

let token: string;
let userId: string;
let token2: string;
let userId2: string;
let userId3: string;
let postId: string;

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

    const post = await request(app).post("/posts/create").set("Authorization", `Bearer ${token}`).send({
        "title": "Post para testing 1",
        "content": "Este es un post de prueba y creado para testing"
    });
    postId = post.body.id
});

afterAll(() => {
    server.close();
});

describe("POST/posts/create", () => {
    test("should respond with a 200 status code when a post is created succesfully", async () => {
        const response = await request(app).post("/posts/create").set("Authorization", `Bearer ${token2}`).send({
            "title": "Post para testing 2",
            "content": "Este es otro post de prueba y creado para testing"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toEqual("Post para testing 2");
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).post("/posts/create").send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).post("/posts/create").set("Authorization", `Bearer ${token}`).send({
            "title": "Post para testing 1",
            "content": null
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "Invalid data format" })
    });
});

describe("PUT/posts/:postId", () => {
    test("should respond with a 200 status code when a post is updated succesfully", async () => {
        const response = await request(app).put(`/posts/${postId}`).set("Authorization", `Bearer ${token}`).send({
            "title": "Post para testing 1 editado",
            "content": "Este es un post de prueba y creado para testing"
        });  
        expect(response.statusCode).toBe(200); 
        expect(response.body.title).toEqual("Post para testing 1 editado");        
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).put(`/posts/${postId}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 401 status code when an user isn`t authorized to update another user post", async () => {
        const response = await request(app).put(`/posts/${postId}`).set("Authorization", `Bearer ${token2}`).send({
            "title": "Post para testing 1 editado",
            "content": "Este es un post de prueba y creado para testing"
        });                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "User isn't authorized to update this post" });
    });

    test("should respond with a 404 status code when a post doesn't exists", async () => {
        const response = await request(app).put(`/posts/xxxx`).set("Authorization", `Bearer ${token}`).send({
            "title": "Post para testing 1 editado",
            "content": "Este es un post de prueba y creado para testing"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "Post doesn't exists" });
    });

    test("should respond with a 422 status code when data format is invalid", async () => {
        const response = await request(app).put(`/posts/${postId}`).set("Authorization", `Bearer ${token}`).send({
            "title": null,
            "content": "Este es otro post de prueba y creado para testing"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual({ error: "invalid data format" });
    });
});

describe("DELETE/posts/:postId", () =>{
    test("should respond with a 401 status code when an user isn`t authorized to delete another user post", async () => {
        const response = await request(app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${token2}`).send();
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "User isn't authorized to delete this post" });
    });

    test("should respond with a 200 status code when a post is deleted succesfully", async () => {
        const response = await request(app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: "Post deleted"})
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).delete(`/posts/${postId}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with 404 status code when a post doesn`t exists", async () => {
        const response = await request(app).delete(`/posts/xxxx`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "Post doesn't exists" });
    }); 
});

describe("PATCH/posts/:postId/recover", () => {
    test("should respond with a 401 status code when an user isn`t authorized to recover another user post", async () => {
        const response = await request(app).patch(`/posts/${postId}/recover`).set("Authorization", `Bearer ${token2}`).send();
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: "user isn't authorized to recover this post" });
    });

    test("should respond with a 200 status code when a deleted post is recovered succesfully", async () => {
        const response = await request(app).patch(`/posts/${postId}/recover`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: "Post recovered"});
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).patch(`/posts/${postId}/recover`).send();
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 404 status code when a post doesn`t exists", async () => {
        const response = await request(app).patch(`/posts/xxxx/recover`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "Post doesn't exists" });
    });
});

describe("GET/posts", () => {
    test("should respond with a 200 status code when post list is displayed succesfully", async () => {
        const response = await request(app).get("/posts").set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).get("/posts").send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });
})

describe("GET/posts/users/:userId", () => {
    test("should respond with a 200 status code when an user post list is displayed succesfully", async () => {
        const response = await request(app).get(`/posts/users/${userId}`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).get(`/posts/users/${userId}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });
});

describe("GET/posts/users/:userId/deleted", () => {
    test("should respond with a 200 status code when an user post list is displayed succesfully", async () => {
        const deletedPost = await request(app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${token}`).send();
        const response = await request(app).get(`/posts/users/${userId}/deleted`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("should respond with a 204 status code when an user post list is empty", async () => {
        const recoveredPost = await request(app).patch(`/posts/${postId}/recover`).set("Authorization", `Bearer ${token}`).send();
        const response = await request(app).get(`/posts/users/${userId}/deleted`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(204);
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).get(`/posts/users/${userId}/deleted`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });
});

describe("GET/posts/:postId", () => {
    test("should respond with a 200 status code when a post is displayed by id", async () => {
        const response = await request(app).get(`/posts/${postId}`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.post.title).toEqual("Post para testing 1 editado"); 
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).get(`/posts/${postId}`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 404 status code when a post doesn't exists", async () => {
        const response = await request(app).get(`/posts/xxxxx`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "Post doesn't exists" });
    });
});

describe("POST/posts/:postId/like", () => {
    test("should respond with a 200 status code when a post is liked", async () => {
        const response = await request(app).post(`/posts/${postId}/like`).set("Authorization", `Bearer ${token2}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ success: "Post liked"});
    });

    test("should respond with a 401 status code when access token is missing", async () => {
        const response = await request(app).post(`/posts/${postId}/like`).send();                                              
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Access token is missing' });
    });

    test("should respond with a 401 status code when an user tries to like his own post", async () => {
        const response = await request(app).post(`/posts/${postId}/like`).set("Authorization", `Bearer ${token}`).send();
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ success: "User isn't authorized to like his own post"});
    });

    test("should respond with a 404 status code when the post doesn't exists", async () => {
        const response = await request(app).post(`/posts/xxxx/like`).set("Authorization", `Bearer ${token2}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "Post doesn't exists" });
    });

    test("should respond with a 409 status code when an user tries to like a post that he already likes it before", async () => {
        const response = await request(app).post(`/posts/${postId}/like`).set("Authorization", `Bearer ${token2}`).send();
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({ success: "User already liked this post once."});
    })
})
