import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

export const authMiddleware = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  console.log(
    "auth middleware - cookies:",
    req.cookies,
    "auth header:",
    req.headers.authorization
  );

  const token =
    req.cookies?.token ??
    req.cookies?.jwt ??
    (req.headers?.authorization
      ? String(req.headers.authorization).split(" ")[1]
      : undefined);

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log("decoded JWT payload:", decoded);

    const normalizedId = decoded?.userID ?? decoded?.userId ?? decoded?.id;
    if (!normalizedId) {
      console.error("No user id found in token payload");
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: normalizedId, ...decoded };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};
