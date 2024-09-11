import dotenv from 'dotenv';
import path from 'path';
import { MongoClient } from "mongodb";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function connectToDatabase() {
    const uri: string | undefined = process.env.DB_URI;
    console.log("DB URI:", uri);

    if (!uri) {
        throw new Error('Database URI is undefined');
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db();
        return db;  
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;  
    }
}

