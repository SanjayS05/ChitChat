import dotenv from "dotenv";
dotenv.config();

export const config = {
    sessionSecret: process.env.SESSION_SECRET
};