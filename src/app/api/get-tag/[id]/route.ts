import clientPromise from "@/utils/database";
import { Tag } from "@/utils/schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1]; // 마지막 segment가 [id]

  try {
    const client = await clientPromise;
    const db = client.db("scraping");

    const data = await db
      .collection<Tag>("tags")
      .find({ userid: id })
      .toArray();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error connecting to database or performing operations:", error);
    return new Response("Error connecting to database", { status: 500 });
  }
}
