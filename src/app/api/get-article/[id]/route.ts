import clientPromise from "@/utils/database";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pathParts = url.pathname.split("/");
  const id = pathParts[pathParts.length - 1]; // 마지막 segment가 id

  try {
    const client = await clientPromise;
    const db = client.db("scraping");

    const articles = await db
      .collection("article")
      .find({ user: id })
      .toArray();

    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" }, // ✅ 고침
    });
  } catch (error) {
    console.error("DB 오류:", error);
    return new Response("Error connecting to database", { status: 500 });
  }
}
