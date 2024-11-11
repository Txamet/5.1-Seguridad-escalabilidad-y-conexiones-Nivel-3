import dotenv from "dotenv";

const PORT = process.env.PORT || 3214;

export const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "Blog API", version: "1.0.0"},
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },

    apis: ["./src/infrastructure/routes/*.ts"]
};
