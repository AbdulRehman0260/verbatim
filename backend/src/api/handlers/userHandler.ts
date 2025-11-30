import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { getUserByEmail, createUser } from "../../db/queries/users.js";
import {
  hashPassword,
  checkPasswordHash,
} from "../../db/authentication/auth.js"; // Changed import
import jwt from "jsonwebtoken";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await getUserByEmail(email, password);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password); // Use argon2
    const newUser = await createUser({
      name,
      email,
      hashedPassword,
    });

    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const token = jwt.sign(
      { userID: newUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await checkPasswordHash(
      password,
      user.hashedPassword
    ); // Use argon2
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userID: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  return res.json({ message: "Logout successful" });
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // From authMiddleware

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};
