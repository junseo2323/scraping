import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId'); 

    if (!userId || !ObjectId.isValid(userId)) {
        return new NextResponse('Invalid or missing user ID', { status: 400 });
    }

    try{
        const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!result) {
            return new NextResponse('user not found', { status: 404 });
        }
        return NextResponse.json({ 
            username: result.nickname,
            email: result.email, 
            subtitle: result.subtitle
        });


    }catch(error){
        return new NextResponse('ERROR',{status: 402});
    }
} 