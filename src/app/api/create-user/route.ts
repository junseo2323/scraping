/**
 curl -X POST http://localhost:3000/absproxy/3000/api/create-user \
-H "Content-Type: application/json" \
-d '{
    "user": {
        "password": "securepassword",
        "name": "John Doe",
        "subtitle": "Developer",
        "article": []
    }
}'
 
 
 */
import { Db } from "@/utils/database";
import { User } from "@/utils/schema";

export async function POST(request: Request) {
    const db = await Db.connect()
    const user = await request.json()
    try {
        await db.collection<User>('users').insertOne(user)
        return new Response('success'); 
    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    } 
}
