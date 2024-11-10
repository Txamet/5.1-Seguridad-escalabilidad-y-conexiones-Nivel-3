import express from "express";
import userRoutes from "./infrastructure/routes/user-routes";
import postRoutes from "./infrastructure/routes/post-routes"
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

export const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
  }));

const PORT = process.env.PORT || 3214;

const BASE_URL = `http://localhost:${PORT}`;
module.exports={BASE_URL}

 export const server = app.listen(PORT,()=>
   console.log(`Server ready at: ${BASE_URL}`)
);

app.use(express.urlencoded({extended: false}))

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    })
});