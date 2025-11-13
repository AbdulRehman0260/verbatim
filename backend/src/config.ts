import type { MigrationConfig } from "drizzle-orm/migrator";
import dotenv from 'dotenv';

dotenv.config()

export type Config = {
    db: dbConfig,
    api: apiConfig
}

export type apiConfig = {
    port: number
}

export type dbConfig = {
    url: string,
    migrationConfig: MigrationConfig
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: './src/db/migrations',
};

 export const config: Config = {
    db: {
        url: process.env.DATABASE_URL as string,
        migrationConfig: migrationConfig
    },
    api: {
        port: Number(process.env.SERVER_PORT)
    }
}; 