import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { Db } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, ...restInfo } = req.body;
	
    // MongoDB 연결
    const db = await Db.connect()
	
    // 기존의 가입된 이메일 체크하기
    const checkExisting = await db.collection('users').findOne({ email });

    if (checkExisting) {
      res.status(422).json({ result: false, error: '이미 가입된 계정이에요!' });
      return;
    }

    const status = await db.collection('users').insertOne({
      email,
      password: await hash(password, 12),
      ...restInfo,
    });
	
    res.status(201).json({ result: true, message: 'User created', ...status });
  } else {
    res.status(500).json({ result: false, error: 'Route not valid' });
  }
}
