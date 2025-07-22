// 태그를 작성하는 API
import clientPromise from "@/utils/database";

import { Tag } from "@/utils/schema";

export async function POST(request: Request) {
    const client = await clientPromise;
  const db = client.db('scraping');

    try {
        // Parse the request body
        const requestBody = await request.json();
        const { userid,tagname, color } = requestBody;

        // Validate input
        if (!tagname || !color) {
            return new Response('Invalid input. Both tagname and color are required.', { status: 400 });
        }

        // Insert data into the 'tags' collection
        const result = await db.collection<Tag>('tags').insertOne({ userid,tagname, color });

        // Return a success response
        return new Response(JSON.stringify({ insertedId: result.insertedId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}
