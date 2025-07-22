// 유저가 작성한 모든 게시물의 ID를 가져오는 API
import clientPromise from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    const client = await clientPromise;
    const db = client.db('scraping');

    try{
        const data = await db.collection('write').find({}, {projection: {_id : 1}});
        
        const arr = await data.toArray();
        const ids = arr.map(arrs => (arrs._id).toString());

        return NextResponse.json(ids);
    }catch(error){
        return NextResponse.json("ERROR"+error,{status: 400});
    }


}