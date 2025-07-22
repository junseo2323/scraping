// 게시글을 삭제하는 API
import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import { del } from '@vercel/blob';

interface RequestBody {
    _id?: string;
}

export async function DELETE(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');
  
    try {
        // Parse the URL or request body for the tagname
        const requestBody: RequestBody = await request.json();
        const { _id } = requestBody;

        if (!_id) {
            return new Response('Missing tagname parameter.', { status: 400 });
        }

        let objectId;
        try {
            objectId = new ObjectId(_id);
        } catch (error) {
            return new Response('Invalid _id parameter.', { status: 400 });
        }

        const article = await db.collection('article').findOne({_id:objectId});

        if (!article) {
            return new Response('Article is already deleted', { status: 400 });
        }

        if(article.flatform == 'scraping'){
            const url = article.url;
            const articleId = url.match(/article\/([a-f0-9]{24})/)[1];
            const data = await db.collection('write').findOne({_id: new ObjectId(articleId)},{ projection: { images: 1 } })
            if(data){
                if(Array.isArray(data.images)){
                    for (const url of data.images) {
                        const path = url.replace('https://blob.vercel-storage.com/', '');
                        await del(path);
                    }
                }
            }
              
            const result = await db.collection('write').deleteOne({_id: new ObjectId(articleId)});
        }

        const result = await db.collection('article').deleteOne({ _id:objectId });

        if (result.deletedCount === 0) {
            return new Response('No document found with the specified articleurl.', { status: 404 });
        }

        // Return a success response
        return new Response('Document deleted successfully.', { status: 200 });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}