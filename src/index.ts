import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import connectDB from "./configs/connectDB";
import routers from "./routes";
import http from "http";
import https from "https";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/user-service", routers);

let server: http.Server | https.Server;

if (process.env.NODE_ENV === "production") {
  const keyPath = process.env.SSL_KEY_PATH!; // ! after env variables tells TypeScript you’re sure they are not undefined (optional).
  const certPath = process.env.SSL_CERT_PATH!;

  const key = fs.readFileSync(path.resolve(keyPath), "utf8");
  const cert = fs.readFileSync(path.resolve(certPath), "utf8");

  server = https.createServer({ key, cert }, app);
} else {
  server = http.createServer(app);
}

server.listen(3000, () => {
  connectDB();
  console.log("✅ User service is running on port 3000");
});
