import clientPromise from "@/utils/database";
import { Tag } from "@/utils/schema";

export async function GET(request: Request,
                        { params }: { params: {id: string } }) {
    const client = await clientPromise;
    const db = client.db('scraping');
    const { id } = params;

    try {
        const data = await db.collection<Tag>('tags').find({userid: id}).toArray()
        const documents = data;

        return new Response(JSON.stringify(documents), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    } 
}
