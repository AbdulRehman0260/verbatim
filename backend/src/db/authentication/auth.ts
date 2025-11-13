import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
    try {
        const hashed = await argon2.hash(password);
        return hashed;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to hash password")}}


export const checkPasswordHash = async (password:string, hash:string): Promise <boolean> => {
    try {
        return await argon2.verify(hash, password) ? true : false;
    } catch (err) {
        console.error('Password verification failed:', err);
        return false;
    }
}