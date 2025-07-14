// app/article/[articleId]/layout.tsx
import axios from 'axios';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'; // 데이터를 찾지 못할 경우 처리
import { use } from "react";

type PageParams = Promise<{ articleId: string }>;


export async function generateMetadata({ 
  params 
}: { params: PageParams}) {
  const { articleId } = await params;

  // 여기서 API 호출이나 DB 쿼리로 해당 articleId의 정보를 가져온다.
  const article = await fetchArticleById(articleId);

  if (!article) {
    notFound();  // 해당 아티클을 못 찾으면 404 페이지로 이동
  }

  return {
    title: `Scraping - ${article.title}`,
    description: article.content.slice(0, 150), // 내용 일부를 설명으로 사용
    openGraph: {
      title: `Scraping - ${article.title}`,
      description: article.content.slice(0, 150),
      url: article.url,
      images: [
        {
          url: article.image || '',
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}

const fetchArticleById = async(id: string) => {
    try{
        const res = await axios.get(process.env.NEXT_PUBLIC_SCRAPING_URL+`/api/write/${id}`);
        return res.data;
    }catch(error){
        console.log(error);
    }
}

const articleIdFetcher = async(url: string) => {
    try{
        const res = await axios.get(process.env.NEXT_PUBLIC_SCRAPING_URL+'/api/get-articleId?url='+url);
        return res.data;
    }catch(err){
        console.error(err);
    }
}