import { db } from '../index.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';
import type { User } from '../schema.js';

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Create a new user. Accepts a NewUser and returns the full User record from DB.
export const createUser = async (user: NewUser): Promise<User | undefined> => {
    const [createdUser] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return createdUser;
};

//get user by email for login authentication
export const getUserByEmail  = async (email:string,password:string):Promise<User> => {
    const [user] = await db.select().from(users).where(eq(users.email,email)).limit(1)
    return user
}
