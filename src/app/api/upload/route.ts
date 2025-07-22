// 파일 업로드 API
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
  
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
  
    const blob = await put(file.name, file, {
      access: 'public', // 또는 'private'로 하면 인증 필요
      addRandomSuffix: true
    });
  
    return NextResponse.json({ url: blob.url }); // blob.url이 공개 이미지 링크!
  }
  