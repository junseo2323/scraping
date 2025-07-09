import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { del } from '@vercel/blob';

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('scraping');

    try {
        // Parse the URL or request body for the tagname
        const body = await req.json();
        const { _id } = body;

        if (!_id) {
            return new NextResponse('Missing tagname parameter.', { status: 400 });
        }

        let delcount = 0;

        const articles = await db.collection('article').find({user:_id}).toArray();


        if (!articles) {
            return new NextResponse('Article is already deleted', { status: 400 });
        }

        //Article, Write 삭제
        for (const article of articles) {
        // article이 'scraping' 플랫폼인지 확인
        if (article.flatform === 'scraping') {
            const url = article.url;
            // URL에서 articleId를 추출 (정규식 사용)
            const articleId = url.match(/article\/([a-f0-9]{24})/)[1];

            // 'write' 컬렉션에서 해당 articleId를 기반으로 데이터를 찾음
            const data = await db.collection('write').findOne(
                { _id: new ObjectId(articleId) },
                { projection: { images: 1 } } // 이미지 필드만 가져옴
            );

            // 데이터를 찾았고, images 필드가 존재하면
            if (data && Array.isArray(data.images)) {
                // images 배열을 순회하며 처리
                for (const imageUrl of data.images) {
                    // 이미지 URL에서 Blob 경로를 제거하고, 파일 경로 추출
                    const path = imageUrl.replace('https://blob.vercel-storage.com/', '');
                    // 경로를 이용해 파일을 삭제 (del 함수 사용)
                    await del(path);
                    }
            }
            const result = await db.collection('write').deleteOne({_id: new ObjectId(articleId)});
            delcount += result.deletedCount;

        }
            const result = await db.collection('article').deleteOne({ _id:article._id });
            delcount += result.deletedCount;

        }

        //tag 삭제
        const result = await db.collection('tags').deleteMany({userid:_id});
        delcount += result.deletedCount;
        console.log(delcount);

        //user 정보 삭제
        const userres = await db.collection('users').deleteMany({_id:new ObjectId(_id)});
        console.log(userres);



        if (delcount === 0) {
            return new NextResponse('No document found with the specified articleurl.', { status: 404 });
        }

        // Return a success response
        return new NextResponse('Document deleted successfully. '+delcount, { status: 200 });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new NextResponse('Error connecting to database', { status: 500 });
    }

}