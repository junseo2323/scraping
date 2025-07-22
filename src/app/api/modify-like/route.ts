import clientPromise from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("scraping");

  const body = await req.json();

  try {
    const collection = db.collection("likes");

    let updateQuery = {};
    let options = {};

    if (body.type === "like" && body.userId) {
      updateQuery = {
        $addToSet: { liker: body.userId }, // liker는 배열이어야 함
      };
    } else if (body.type === "comment" && body.userId && body.commentText) {
      updateQuery = {
        $set: {
          'comment.$[elem].commentText': body.commentText,
        },
      };
      body.commentId = new ObjectId(body.commentId);
      options = {
        arrayFilters: [
          {'elem.commentId': body.commentId}
        ],
      }
    } else {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { articleId: body.articleId }, // 필터
      updateQuery,
      options
    );
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
