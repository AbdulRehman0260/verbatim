import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { getLikesHandler, likePostHandler, } from "./api/handlers/likesHandler.js";
import { createCommentHandler, deleteCommentHandler, getCommentsByPostIdHandler, } from "./api/handlers/commentsHandler.js";
import { createUserHandler, getCurrentUserHandler, loginUserHandler, logoutHandler, } from "./api/handlers/userHandler.js";
import { createPostHandler, getAllPostsHandler, getPostByIdHandler, imageUploadHandler, } from "./api/handlers/postHandler.js";
import { authMiddleware } from "./db/authentication/auth.js";
dotenv.config();
console.log("Loaded DATABASE_URL =", process.env.DATABASE_URL);
const sql = postgres(config.db.url, { max: 1 });
await migrate(drizzle(sql), config.db.migrationConfig);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));
const FRONTEND_ORIGIN = process.env.FRONTEND_URL ?? "http://localhost:5173";
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
}));
// users api calls
app.post("/api/users", createUserHandler);
app.post("/api/login", loginUserHandler);
app.post("/api/logout", logoutHandler);
// post api calls
app.get("/upload-url", authMiddleware, imageUploadHandler);
app.get("/api/posts", getAllPostsHandler);
app.get("/api/posts/:id", getPostByIdHandler);
app.post("/api/posts", authMiddleware, createPostHandler);
// comments api calls
app.get("/api/comments/:postId", getCommentsByPostIdHandler);
app.post("/api/comments/:postId", authMiddleware, createCommentHandler);
app.delete("/api/comments/:commentId", authMiddleware, deleteCommentHandler);
// likes api calls
app.get("/api/likes/:postId", getLikesHandler);
app.post("/api/likes/:postId", authMiddleware, likePostHandler);
//auth api calls
app.get("/api/me", authMiddleware, getCurrentUserHandler);
app.listen(config.api.port, () => {
    console.log(`http://localhost:${config.api.port}`);
    console.log(`Server is running on port ${config.api.port}`);
});
