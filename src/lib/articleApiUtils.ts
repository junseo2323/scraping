import clientPromise from "@/utils/database";
import axios from "axios";
import Swal from "sweetalert2";

interface LikeDocument {
    articleId: string;
    liker: string[];
    comment: { userId: string; content: string }[];
}

export async function handleArticlePost(request: Request) {
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
        return { success: true, message: 'Data processed successfully',insertedId: result.insertedId,likerId: likeresult.insertedId };
    } catch (error) {
        return { success: false, message: 'Error connecting to database' };
    }
}
