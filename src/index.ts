import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB";
import routers from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/user-service' , routers)

app.listen(3000, () => {
    connectDB()
  console.log("User service is running on port 3000");
});
