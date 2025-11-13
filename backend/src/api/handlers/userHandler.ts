import type { Request,Response } from "express";
import { generateToken } from "../utils/utils.js";
import { checkPasswordHash, hashPassword } from "../../db/authentication/auth.js";
import { createUser, getUserByEmail } from "../../db/queries/users.js";

export const createUserHandler = async (req:Request,res:Response) => {
    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({message: "Missing required fields"})

    }
        const hashedPassword:string = await hashPassword(password);

        const dbUser = await createUser({name,email,hashedPassword})

        if (dbUser) {
            generateToken(dbUser.id,res)
        }

        res.status(201).json(dbUser)

    } catch (error) {
    res.status(500).json({error:"Internal Server Error"})        
    }
};

export const loginUserHandler = async (req:Request,res:Response) => {
    try {
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message:"Missing required fields"})
        }
        const hashUser = await getUserByEmail(email,password)

        if (!hashUser) {
            return new Error("Error retrieving hashed password from database")
        }

        const verifyPassword = await checkPasswordHash(password,hashUser.hashedPassword)

        if (!verifyPassword) {
            return res.status(404).json({error:"Incorrect login details"})
        }

        generateToken(hashUser.id,res)

        return res.status(200).json({message:"User signed in successfully"})
    } catch (error) {
        
    }
}

export const logoutHandler = (req:Request, res:Response) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}