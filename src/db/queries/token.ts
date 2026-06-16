import { db } from "../index.js";
import { users, refresh_token } from "../../schema.js";
import {eq} from "drizzle-orm";

export async function createRefreshToken(refreshToken: string, userId: string) {
  const [result] = await db
    .insert(refresh_token)
    .values({
      token: refreshToken,
      user_id: userId,
        expiresAt: new Date(Date.now() + 60 * 3600* 24),//60 days
    })
    .returning();
  return result;
}

export async function getRefreshToken(token: string) {
    return db.select().from(refresh_token).where(eq(refresh_token.token, token));
}

export async function revokeRefreshToken(token: string) {
    db.update(refresh_token).set({revokedAt: new Date()}).where(eq(refresh_token.token, token));
}