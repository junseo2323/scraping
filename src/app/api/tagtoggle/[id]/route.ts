import clientPromise from "@/utils/database";
import { User } from "@/utils/schema";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  try {
    const client = await clientPromise;
    const db = client.db("scraping");

    const data = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })

      return NextResponse.json({
        home : data?.tagtoggle.home,
        profile: data?.tagtoggle.profile
    })
  } catch (error) {
    return NextResponse.json({error}, {status: 404})
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  const body = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("scraping");
    const collection = db.collection("users");
    
    let updateQuery = {};

    if (body.type === 'home'){
      updateQuery = {
        $set: {home: body.tag}
      }
    }else if (body.type === 'profile'){
      updateQuery = {
        $set: {profile: body.tag}
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id)}, // 필터
      updateQuery
    );
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });

  } catch (error) {
    return NextResponse.json({error}, {status: 404})
  }
}
