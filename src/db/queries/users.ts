import { db } from "../index.js";
import { NewUser, users } from "../../schema.js";
import {eq} from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email,email));
  return result;
}

export async function updateUser(email: string, hashed_password: string,user_id : string) {
  await db.update(users).set({hashed_password: hashed_password,email:email}).where(eq(users.id, user_id));
}

export async function getUserById(id: string) {return db.select().from(users).where(eq(users.id, id));}

export async function upgradeChripsById(id: string) {
  await db.update(users).set({is_chirpy_red : true}).where(eq(users.id, id));
}
