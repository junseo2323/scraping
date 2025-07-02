import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from 'jsdom'
import axios from "axios"
import * as cheerio from 'cheerio';

const getNaverBlogStandardURL = async(htmlBody: string) => {
    const ogs = require("open-graph-scraper")

    const noEnter = htmlBody.replace("\n", "")
    const dom = new JSDOM(noEnter)
    const iFrameTag = dom.window.document.querySelector("#mainFrame")

    if (iFrameTag && iFrameTag.getAttribute('allowfullscreen')) {
        const src = iFrameTag.getAttribute('src')
        const iframeResponse = await axios.get(`https://blog.naver.com${src}`)
        const iframeData = iframeResponse.data
        const iframeResult = await ogs({ html: iframeData })

        return iframeResult
    }
    return null
};

const getFlatform = (url : string) => {
    const flatformList = {
        'blog.naver' : 'naver-blog',
        'youtube' : 'youtube',
        'tistory' : 'tistory',
        'cafe.naver' : 'naver-cafe',
        'news' : 'news',
        'velog' : 'velog'
    } 
    type FlatformList = typeof flatformList;

    const keys = Object.keys(flatformList) as Array<keyof FlatformList>;

    for(let i of keys) {
        if(url.includes(i)) return flatformList[i]
    }

    return 'ext'

}
function encodeKoreanInURL(url : string) {
    // URL을 파싱하여 각 구성 요소를 추출
    const urlObj = new URL(url);

    // URL의 searchParams를 사용하여 쿼리 파라미터를 처리
    const searchParams = new URLSearchParams(urlObj.search);
    searchParams.forEach((value, key) => {
        // 한글이 포함된 값만 인코딩
        if (/[\u3130-\u318F\uAC00-\uD7AF]/.test(value)) {
            searchParams.set(key, encodeURIComponent(value));
        }
    });

    // 인코딩된 쿼리 문자열을 다시 URL에 설정
    urlObj.search = searchParams.toString();

    // 인코딩된 URL을 반환
    return urlObj.toString();
}

//유튜브 Id추출
function extractYouTubeVideoId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
  
      // 일반적인 유튜브 링크: https://www.youtube.com/watch?v=VIDEO_ID
      if (hostname.includes('youtube.com')) {
        return parsedUrl.searchParams.get('v');
      }
  
      // 단축 링크: https://youtu.be/VIDEO_ID
      if (hostname.includes('youtu.be')) {
        return parsedUrl.pathname.slice(1);
      }
  
      return null;
    } catch (err) {
      console.error('Invalid URL', err);
      return null;
    }
}

const fetchFail = async(url: string) => {
    try {
        // URL에서 HTML 문서 가져오기
        const response = await axios.get(url);

        // 응답 상태 코드가 200인지 확인
        if (response.status !== 200) {
          throw new Error(`HTTP 요청 실패: ${response.status}`);
        }
    
        const data = response.data;
        // cheerio로 HTML 파싱
        const $ = cheerio.load(data);
    
        // 메타 태그 파싱
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const description = $('meta[property="og:description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';
    
        // 결과 반환
        return { title, description, image };
      } catch (error) {
        console.error('Error fetching metadata:', error);
        throw new Error('메타 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    
      
}

export async function GET(request: NextRequest) {
    const ogs = require("open-graph-scraper");
    const reqUrl:any = request.nextUrl.searchParams.get("url")
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    try{
        let resdata;
        if(reqUrl.includes('blog.naver')){ 
            const naverresponse = await axios.get(reqUrl)
            const htmlBody = naverresponse.data;
            const {result} = await getNaverBlogStandardURL(htmlBody);
            resdata = result

        }else if(reqUrl.includes('youtube')){
            const VIDEO_ID = extractYouTubeVideoId(reqUrl);
            try{
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${YOUTUBE_API_KEY}`
                );
                const ress = await res.json();
                const data = ress.items[0].snippet;
                resdata = {
                    ogTitle: data.title,
                    ogDescription: data.description,
                    ogUrl: reqUrl,
                    ogImage: data.thumbnails.medium.url
               }
            }catch(error){
                console.error(error);
            }
            
        }else{
            const data = await ogs({url: encodeKoreanInURL(reqUrl)})
            const {result} = data
            resdata = result
        }
    
    
    return NextResponse.json({data:{        
        title: resdata.ogTitle,
        subtitle: resdata.ogDescription,
        url: resdata.ogUrl,
        image: resdata.ogImage,
        flatform: getFlatform(resdata.ogUrl)
    }})
    }catch (error) {
        try{
            let resdata;
            const res = await fetchFail(reqUrl);
            resdata = {
                ogTitle: res.title,
                ogDescription: res.description,
                ogUrl: reqUrl,
                ogImage: [res.image]
           }

           return NextResponse.json({data:{        
            title: resdata.ogTitle,
            subtitle: resdata.ogDescription,
            url: resdata.ogUrl,
            image: resdata.ogImage,
            flatform: getFlatform(resdata.ogUrl)
        }})
        
        }catch(error){
            console.error(error);
            return NextResponse.json({
                error: 'Failed to scrape the metadata.',
                message: error,
            }, { status: 500 });    
        }
    }
}
