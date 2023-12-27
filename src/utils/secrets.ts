import dotenv from 'dotenv';
dotenv.config();

export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_PORT = parseInt(process.env.DB_PORT) as number

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;