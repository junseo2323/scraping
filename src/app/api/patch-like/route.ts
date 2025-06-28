import clientPromise from "@/utils/database";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');

    try {
        // 요청 본문 파싱
        const requestBody = await request.json();
        const { _id, liker, comment } = requestBody;

        if (!_id || !liker || !comment || !comment.text || !comment.userid) {
            return new Response('요청에 필요한 데이터가 부족합니다. _id, liker, comment.text, comment.userid가 필요합니다.', { status: 400 });
        }

        // _id가 문자열이면 ObjectId로 변환
        const objectId = new ObjectId(_id);

        const updateData: any = {};

        if (liker) {
            updateData.liker = { $addToSet: { userid: liker } }; // liker를 추가
        }

        if (comment) {
            updateData.comment = { 
                $push: { 
                    comments: { text: comment.text, userId: comment.userid } 
                } 
            }; // comment 추가
        }

        // upsert 옵션을 사용하여 조건에 맞는 문서가 없으면 새로 생성
        const result = await db.collection('likes').updateOne(
            { _id: objectId },  // 조건: _id가 일치하는 문서를 찾음
            { $set: updateData },  // 업데이트할 데이터
            { upsert: true }  // 문서가 없으면 새로 생성
        );

        // 결과 로그 확인
        console.log('Update result:', result);

        // 새로운 문서가 삽입된 경우
        if (result.upsertedCount > 0) {
            return new Response('새로운 좋아요 및 댓글이 성공적으로 생성되었습니다.', { status: 201 });
        }

        // 문서가 업데이트되었을 경우
        if (result.modifiedCount > 0) {
            return new Response('좋아요 및 댓글이 성공적으로 업데이트되었습니다.', { status: 200 });
        }

        // 변경된 내용이 없을 경우
        return new Response('변경된 내용이 없습니다.', { status: 400 });

    } catch (error) {
        console.error('서버 오류:', error);
        return new Response('서버 오류', { status: 500 });
    }
}
