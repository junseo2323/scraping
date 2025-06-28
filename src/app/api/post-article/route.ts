import clientPromise from "@/utils/database";
interface LikeDocument {
    articleId: string;
    liker: ( string)[];
    comment: { userId: string; content: string }[];
}

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');

    try {
        const requestBody = await request.json();
        const {title,url,image,subtitle,flatform,creator,tag,user } = requestBody;
        
        const result = await db.collection('article').insertOne({ title,url,image,subtitle,flatform,creator,tag,user });
        
        const newLikeDoc: LikeDocument = {
            articleId: String(result.insertedId),
            liker: [],
            comment: []
        }
        const likeresult = await db.collection<LikeDocument>('likes').insertOne(newLikeDoc);

        return new Response(JSON.stringify({ insertedId: result.insertedId, likerId: likeresult.insertedId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }

}
