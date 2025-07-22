// 좋아요 정보를 가져오는 API
import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
interface LikeDocument {
    articleId: string;
    liker: ( string)[];
    comment: {commentId: string; userId: string; commentText: string }[];
}

export async function GET(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');

    try {
        // Extract articleId from query params
        const url = new URL(request.url);
        const articleId = url.searchParams.get('articleId'); // Assuming articleId is passed as a query parameter

        if (!articleId) {
            return new Response('Missing article ID', { status: 400 });
        }

        // Fetch the article's likes and comments from the database
        const article = await db.collection<LikeDocument>('likes').findOne({ articleId: articleId });

        if (!article) {
            return new Response('Article not found', { status: 404 });
        }

        return new Response(
            JSON.stringify({
                liker: article.liker || [],
                comment: article.comment || []
            }), 
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error fetching article likes and comments:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}
