import { api } from "@/utils/api";
import clientPromise from "@/utils/database";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { handleArticlePost } from "@/utils/articleUtils";


export async function POST(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');
    
    try {
        const { title, content, writer,writername,images } = await request.json();

        if (!content || !writer) {
            return NextResponse.json({ error: "content와 writer 필드는 필수입니다." }, { status: 400 });
        }

        const newArticle = {
            title,
            content,
            writer,
            images,
            createdAt: new Date(),
        };
        const result = await db.collection('write').insertOne(newArticle);
        const insertedId = result.insertedId;
        const newUrl = process.env.NEXT_PUBLIC_SCRAPING_URL+'/article/'+insertedId;
        const postArticleBody = {
            title,
            url: newUrl,
            image: images instanceof Array ? images[0] : '',
            subtitle: content,
            flatform: 'scraping',
            creator: writername,
            tag: [], //추후 태그를 넣을 수 있게 수정할 것 .
            user:writer
        }
        const res = await handleArticlePost(new Request(process.env.NEXT_PUBLIC_SCRAPING_URL+'/api/post-aritcle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postArticleBody) // testA의 body를 그대로 전달
        }));
        
        return NextResponse.json({ articleUrl: newUrl, result: res }, { status: 201 });

    } catch (error) {
        console.error('Error in /api/write:', error);
        return NextResponse.json({ error: '데이터베이스 연결 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');
    
    try {
        const writerId = request.nextUrl.searchParams.get("writer");

        if (!writerId) {
            return NextResponse.json({ error: "writer ID는 필수입니다." }, { status: 400 });
        }

        const articles = await db.collection('write').find({ writer: writerId }).toArray();

        return NextResponse.json(articles, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/write:', error);
        return NextResponse.json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
};
