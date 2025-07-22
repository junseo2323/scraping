// 기본 API 라우트
export async function GET(request: Request) {
    const data = 'api 개발중'
    return Response.json({data})
}
