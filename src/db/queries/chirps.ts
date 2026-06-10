import { db } from "../index.js";
import {NewChirp, chirps, users} from "../../schema.js";
import {eq} from "drizzle-orm";

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
  return db.select().from(chirps).where(eq(users.id, id));
}