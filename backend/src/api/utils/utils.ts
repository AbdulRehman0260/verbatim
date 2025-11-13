import { Response } from 'express'
import jwt from 'jsonwebtoken'

export const generateToken = (userID:string,res:Response) => {

    const token = jwt.sign({userID},process.env.JWT_SECRET as string,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token, {
        maxAge:7*24*60*60*1000
    })

    return token
}