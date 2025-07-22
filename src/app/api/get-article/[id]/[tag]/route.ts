// 특정 유저의 특정 태그가 달린 게시글들을 가져오는 API
import clientPromise from "@/utils/database";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {  
  const url = req.nextUrl;

  const id = url.pathname.split("/")[3];  // [id]
  const tag = url.pathname.split("/")[4]; // [tag]

  //TAG 한글 디코딩
  const decodedTag = decodeURIComponent(tag);


  const client = await clientPromise;
  const db = client.db("scraping");

  try {
    const data = await db
      .collection("article")
      .find({ user: id, tag: decodedTag })
      .toArray();

      return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB error:", error);
    return new Response("Error connecting to database", { status: 500 });
  }
}
