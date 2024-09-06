import { Db } from "@/utils/database";
import { Tag } from "@/utils/schema";

export async function GET(request: Request) {
    const db = await Db.connect()

    try {
        const data = await db.collection<Tag>('tags').find().toArray()

        const documents = data;

        return new Response(JSON.stringify(documents), {
            headers: { 'Content-Type': 'Content-Type' },
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    } 
}
