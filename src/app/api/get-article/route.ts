// 모든 게시글을 가져오는 API
import clientPromise from "@/utils/database";

export async function GET(
    request: Request,
    ) {
        const client = await clientPromise;
        const db = client.db('scraping');

    try {
        const data = await db.collection('article').find().toArray()
        const documents = data;

        return new Response(JSON.stringify(documents), {
            headers: { 'Content-Type': 'Content-Type' },
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    } 
}
