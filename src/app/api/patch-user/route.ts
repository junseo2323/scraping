// 유저 정보를 업데이트하는 API
import clientPromise from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("scraping");

  const body = await req.json();

  try {
    const collection = db.collection("users");

    const updateQuery = {
        $set: { 
            nickname: body.username,
            subtitle: body.subtitle 
        }
    };


    const result = await collection.updateOne(
      { _id: new ObjectId(body.userId) }, // 필터
      updateQuery
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
