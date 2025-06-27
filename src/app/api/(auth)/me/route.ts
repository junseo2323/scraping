// app/api/me/route.ts
import clientPromise from "@/utils/database";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db('scraping');


  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      email: string;
    };

    // DB에서 유저 조회
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // 클라이언트에 보낼 정보만 추려서 반환
    const { _id,email, nickname, subtitle } = user;

    return new Response(JSON.stringify({ _id,email, nickname, subtitle }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return new Response("Invalid token", { status: 401 });
  }
}
