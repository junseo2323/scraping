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
            const data = await ogs({url: reqUrl})
            const {result} = data
            resdata = result
        }
        
    return NextResponse.json({data:{        
        title: resdata.ogTitle,
        subtitle: resdata.ogDescription,
        url: resdata.ogUrl,
        image: resdata.ogImage,
        flatform: resdata.favicon
    }})
    } catch (error) {
        console.error('Error scraping OG data:', error);
        return null;
      }
}
