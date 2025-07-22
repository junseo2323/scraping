// 게시글을 작성하는 API
import { handleArticlePost } from "@/utils/articleUtils";

export async function POST(request: Request) {
    try {
        const result = await handleArticlePost(request); 
        return new Response(JSON.stringify(result), { status: 200 });
      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
      }
}