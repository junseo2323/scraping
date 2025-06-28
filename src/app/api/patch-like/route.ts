import clientPromise from "@/utils/database";
import { NextRequest,NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const client = await clientPromise;
    const db = client.db('scraping');

    const body = await req.json();

    try{
        const collection = db.collection('likes');

        let updateQuery = {};

        if(body.type === 'like' && body.userId){
            updateQuery = {
                $addToSet: { liker: body.userId }
            };
        }else if (body.type === 'comment' && body.userId && body.content) {
            // comment 배열에 추가
            updateQuery = {
              $push: {
                comment: {
                  userId: body.userId,
                  content: body.content
                }
              }
            };
          } else {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
          }
        const result = await collection.updateOne(
            {articleId: body.articleId},
            updateQuery
        );
        console.log(result);
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });

    }catch(error) {
        console.error(error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }

}