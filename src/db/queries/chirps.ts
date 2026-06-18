import { db } from "../index.js";
import {NewChirp, chirps, users} from "../../schema.js";
import {desc, eq} from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getAllChirps()  {
  return db.select().from(chirps);
}

export async function getChirpById(id: string){
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export async function deleteChirpById(id: string) {
  await db.delete(chirps).where(eq(chirps.id, id));
}

export async function getChirpsByUserId(userId: string) {
  return db.select().from(chirps).where(eq(chirps.userId, userId));
}

export async function getAllChirpOrderByCreatedAtDesc(){
  return db.select().from(chirps).orderBy(desc(chirps.createdAt));
}

export async function getAllChirpOrderByCreatedAtAsc(){return db.select().from(chirps).orderBy(chirps.createdAt);}