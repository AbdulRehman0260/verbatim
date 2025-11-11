process.loadEnvFile();

export type apiConfig = {
    dbUrl: string
}

 export const config: apiConfig = {
    dbUrl: process.env.DATABASE_URL as string
};