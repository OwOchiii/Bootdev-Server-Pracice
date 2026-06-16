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