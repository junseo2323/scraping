import { User } from "./schema";
import { Db } from "./database"; 

export async function getUsers(): Promise<User[]> {
    const db = await Db.connect()
    return db.collection<User>('users').find().toArray()
} 