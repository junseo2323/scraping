import clientPromise from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// /api/get-articleId?url='!!'
export async function GET(req: NextRequest){
        const client = await clientPromise;
        const db = client.db('scraping');

        const { searchParams } = new URL(req.url);
        const urlParam = searchParams.get('url');
      
        try{
            const data = await db.collection('article').findOne({url: urlParam});
            return NextResponse.json({data: data},{status: 200});
        }catch(error){
            return NextResponse.json({data: error},{status: 400});
        }
}