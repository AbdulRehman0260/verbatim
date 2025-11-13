import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const protectedRoute = (req:Request, res:Response, next: NextFunction) => {
    try {
    const {token} = req.cookies.jwt

    if (!token) {
        return res.status(401).json({error:"Unauthorized - No token provided"})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET as string)

    if (!decoded) {
        return res.status(400).json({error:"Authorization error: Invalid token"})
    }

    next()

    } catch (error) {
        res.status(500).json({error:"Internal Server Errror"})
    }
}