import express from "express";
import userRoutes from "./infrastructure/routes/user-routes"
import dotenv from "dotenv"

dotenv.config();

export const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3214;

const BASE_URL = `http://localhost:${PORT}`;
module.exports={BASE_URL}

 export const server = app.listen(PORT,()=>
   console.log(`Server ready at: ${BASE_URL}`)
);

app.use(express.urlencoded({extended: false}))

app.use("/users", userRoutes);


app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    })
});