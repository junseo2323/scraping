"use client"

import { FeedArticle } from "@/components/article";
import { fetcher } from "@/utils/api"
import { useEffect, useState } from "react"
import { createArticleData } from "@/types/type";

const fetchArticle = () => {
    const res = fetcher('api/get-article');
    return res;
}

export default function Feed() {
    const [articleMap, setArticleMap] = useState<createArticleData[]>();
    const [articleisLoading, setArticleisLoading] = useState<boolean>();

    const getArticle = async() => {
        setArticleisLoading(true);
        try{
            const res =  await fetchArticle();
            setArticleMap(res);
        }catch(err){
            console.error('에러발생');
        }finally {
            setArticleisLoading(false);
        }
    }

    useEffect(()=>{
        getArticle();
    },[]);
    
    return(
        <div style={{maxWidth: '100vw'}}>
            <div className="grid grid-cols-1 feed_sm:grid-cols-2 feed_md:grid-cols-3 feed_lg:grid-cols-4 gap-x-8 px-8 feed_md:px-16 feed_lg:px-32 gap-y-5">
            {
                (!articleisLoading && articleMap) && articleMap.map((i: createArticleData) => (
                    <FeedArticle key={i._id} articleData={i}  />
                ))
            }
            </div>
        </div>
    )
}