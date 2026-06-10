import {db} from "../index.js";
import {chirp} from "../../schema.js";

export async function getChirps() {
    return db.select().from(chirp);
}

export async function createChirps(body: string, userId: string) {
    return db.insert(chirp).values({body, userId}).returning();
}