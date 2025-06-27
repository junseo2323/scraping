import { User } from "./schema";
import clientPromise from "@/utils/database";


export async function getUsers(): Promise<User[]> {
    const client = await clientPromise;
    const db = client.db('scraping');
    return db.collection<User>('users').find().toArray()
} 