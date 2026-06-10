process.loadEnvFile();

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type APIConfig = {
  fileserverHits: number;
  platform: string;
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export const config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
  } as APIConfig,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  } as DBConfig,
};

