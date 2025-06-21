import { Db } from "@/utils/database";

export async function POST(request: Request) {
    const db = await Db.connect()

    try {
        const requestBody = await request.json();
        const {title,url,image,subtitle,flatform,creator,tag } = requestBody;
        
        const result = await db.collection('article').insertOne({ title,url,image,subtitle,flatform,creator,tag });

        return new Response(JSON.stringify({ insertedId: result.insertedId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }

}
