import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "src/config.js";

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashed = await argon2.hash(password);
    return hashed;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

export const checkPasswordHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return (await argon2.verify(hash, password)) ? true : false;
  } catch (err) {
    console.error("Password verification failed:", err);
    return false;
  }
};

// ...existing code...
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(
      "auth middleware - cookies:",
      req.cookies,
      "auth header:",
      req.headers.authorization
    );

    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userID: string;
    };
    console.log("decoded JWT payload:", decoded);

    (req as any).userId = decoded.userID;

    console.log("Auth successful, userId:", (req as any).userId);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
// ...existing code...
