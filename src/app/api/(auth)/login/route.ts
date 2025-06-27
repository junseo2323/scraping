import clientPromise from '@/utils/database';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db('scraping');
    
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response("이메일과 비밀번호는 필수입니다.", { status: 400 });
        }

        // 사용자 조회
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return new Response("이메일 또는 비밀번호가 올바르지 않습니다.", { status: 401 });
        }

        // 비밀번호 비교
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response("이메일 또는 비밀번호가 올바르지 않습니다.", { status: 401 });
        }

        // 토큰 생성
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("로그인 오류:", error);
        return new Response("서버 오류", { status: 500 });
    }
}
