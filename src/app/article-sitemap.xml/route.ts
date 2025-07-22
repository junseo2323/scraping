import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

export async function GET(request: Request) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const fetchdata = await axios.get(process.env.NEXT_PUBLIC_SCRAPING_URL+'/api/get-writtenId');
  const articleIds: string[] = fetchdata.data;
  const sitemapFields: ISitemapField[] = articleIds.map((id_) => {
      return {
          loc: process.env.NEXT_PUBLIC_SCRAPING_URL+`/article/${id_}`, // 페이지 경로
          lastmod: new Date().toISOString(), // 최근변경일자
          changefreq: 'daily', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
          priority: 1, // 페이지 주소 우선순위 (검색엔진에 제공됨, 우선순위가 높은 순서대로 크롤링함)
      }
  });

  return getServerSideSitemap(sitemapFields);
}