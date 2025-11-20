import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userID: string, res: Response) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents JavaScript access (security)
    secure: false, // Set to true in production with HTTPS
    sameSite: "lax", // Important for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function createPresignedUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}
