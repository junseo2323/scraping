import { Db } from "@/utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const db = await Db.connect()

    try {
        const requestBody = await request.json();
        const {email,password,password2,nickname,subtitle} = requestBody;

        if (!email || !password || !nickname) {
            return new Response("필수 항목이 누락되었습니다.", { status: 400 });
        }

        if (password !== password2) {
            return new Response("비밀번호가 일치하지 않습니다.", { status: 400 });
        }

        if (password.length < 8) {
            return new Response("비밀번호는 최소 8자 이상이어야 합니다.", { status: 400 });
        }

        // 중복 이메일 검사
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return new Response("이미 등록된 이메일입니다.", { status: 409 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        

        const result = await db.collection('users').insertOne(
            {email,
            password: hashedPassword,
            nickname,
            subtitle,
            createdAt: new Date(),
        });

        const token = jwt.sign({email, id: result.insertedId}, process.env.JWT_SECRET || 'secret',{expiresIn: "7d",
        });

        return new Response(JSON.stringify({ token }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
        });

    } catch (error) {
        console.error('Error connecting to database or performing operations:', error);
        return new Response('Error connecting to database', { status: 500 });
    }

}
