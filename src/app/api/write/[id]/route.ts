import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1]; // 마지막 segment가 [id]

  try {
    const client = await clientPromise;
    const db = client.db("scraping");
    const objectId = new ObjectId(id);
    if (!objectId) {
        return NextResponse.json({ error: "ID는 필수입니다." }, { status: 400 });
    }
    const article = await db.collection('write').findOne({ _id: objectId });

    if (!article) {
        return NextResponse.json({ error: "Article을 찾을 수 없습니다." }, { status: 400 });
    }

    return NextResponse.json(article, {status: 200 });
  } catch (error) {
    console.error("Error connecting to database or performing operations:", error);
    return NextResponse.json({ error: "ERROR!" }, { status: 400 });
}
}
