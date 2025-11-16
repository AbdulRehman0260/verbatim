import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createUserHandler, loginUserHandler, logoutHandler, } from "./api/handlers/userHandler.js";
dotenv.config();
console.log("Loaded DATABASE_URL =", process.env.DATABASE_URL);
const sql = postgres(config.db.url, { max: 1 });
await migrate(drizzle(sql), config.db.migrationConfig);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
// users api calls
app.post("/api/users", createUserHandler);
app.get("/api/login", loginUserHandler);
app.post("/api/logout", logoutHandler);
app.listen(config.api.port, () => {
    console.log(`http://localhost:${config.api.port}`);
    console.log(`Server is running on port ${config.api.port}`);
});
