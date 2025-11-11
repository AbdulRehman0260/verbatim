import {db} from '../index.js';
import {users} from '../schema.js';
import {eq} from 'drizzle-orm';
import type {User} from '../schema.js';

//create a new user
export const createUser = async (user: User): Promise<User> => {
    const [createdUser] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return createdUser;
}