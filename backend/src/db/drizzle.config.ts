import {defineConfig} from 'drizzle-kit';
 export default defineConfig({
     schema: './schema.ts',
     out: './migrations',
     dialect: 'postgresql',
     dbCredentials: {
         url: 'postgres://postgres:postgres@localhost:5432/verbatim',
     },
 });  