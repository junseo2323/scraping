import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from 'jsdom'
import axios from "axios"

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

export async function GET(request: NextRequest) {
    const ogs = require("open-graph-scraper");
    const reqUrl:any = request.nextUrl.searchParams.get("url")

    try{
        let resdata;
        if(reqUrl.includes('blog.naver')){ 
            const naverresponse = await axios.get(reqUrl)
            const htmlBody = naverresponse.data;
            const {result} = await getNaverBlogStandardURL(htmlBody);
            resdata = result

        } else{
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
    } catch (error) {
        console.error('Error scraping OG data:', error);
        return null;
      }
}
