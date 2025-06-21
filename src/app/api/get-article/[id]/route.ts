import { Db } from "@/utils/database";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
    ) {
    const db = await Db.connect()
    const ids = params.id;

    try {
        const data = await db.collection('article').find({ user: ids }).toArray()
        const documents = data;

        return new Response(JSON.stringify(documents), {
            headers: { 'Content-Type': 'Content-Type' },
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    } 
}
