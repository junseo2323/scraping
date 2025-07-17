import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import {NextRequest, NextResponse} from 'next/server';

interface RequestBody {
    type: string;
    commentId: string;
    articleId: ObjectId;
    userId: string;
}

export async function PATCH(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');
  
    try {
        const requestBody: RequestBody = await request.json();
        const {type,articleId,userId} = requestBody;
        const commentId = new ObjectId(requestBody.commentId);
    

        let updateQuery = {};

        if(type === 'comment'){
            if (!commentId || !articleId) {
                return new Response('Missing tagname parameter.', { status: 400 });
            }

            try {
                updateQuery = {
                    $pull : {
                        comment:{
                            commentId: commentId
                        }
                    }
                }
            } catch (error) {
                return new Response('Invalid _id parameter.', { status: 400 });
            }
        }else {
            if (!userId || !articleId) {
                return new Response('Missing tagname parameter.', { status: 400 });
            }

            try{
                updateQuery = {
                    $pull : {
                        liker: userId
                    }
                }  
            }catch (error) {
                return new Response('Invalid _id parameter.', { status: 400 });
            }
        }

        try{
            // Delete the document with the specified tagname
            const result = await db.collection('likes').updateOne(
                {articleId: articleId },
                updateQuery
            );
            return new Response('Comment deleted successfully.', { status: 200 });
        }catch(error){
            return new Response('Internal Server Error.', { status: 500 });
        }


        // Return a success response

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }
}