import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
} else {
  console.error(".env file not found.");
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";

export const PORT = (process.env.PORT || 5000) as number;

export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_PORT = parseInt(process.env.DB_PORT) as number

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;

export const COOKIE_KEY = process.env.COOKIE_KEY as string;