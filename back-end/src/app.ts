import express from "express";
import userRoutes from "./infrastructure/routes/user-routes";
import postRoutes from "./infrastructure/routes/post-routes";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from  "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swagger";

dotenv.config();

export const app = express();
app.use(express.json());

const specs = swaggerJsDoc(options)

const PORT = process.env.PORT || 3214;
const CORS_PORT = process.env.CORS_PORT || 5173;

app.use(cors({
  origin: `http://localhost:${CORS_PORT}`, 
  methods: 'GET, POST, PUT, PATCH, DELETE',
  credentials: true,
}));

export const BASE_URL = `http://localhost:${PORT}`;
//module.exports={BASE_URL}

export const server = app.listen(PORT,()=>
  console.log(`Server ready at: ${BASE_URL}`)
);

app.use(express.urlencoded({extended: false}))

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    })
});