// 유저 이름을 가져오는 API
import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export  async function GET(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');
    
    try{
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId'); // Assuming articleId is passed as a query parameter
        if (!userId || !ObjectId.isValid(userId)) {
            return new NextResponse('Invalid or missing user ID', { status: 400 });
        }

        const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!result) {
            return new NextResponse('Article not found', { status: 404 });
        }
        return NextResponse.json({ 
            username: result.nickname
        });

    }catch(error){
        console.error(error);
        return new NextResponse('ERROR INIT',{status: 500})
    }
}