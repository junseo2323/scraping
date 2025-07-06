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
            <div className="flex gap-x-4 overflow-x-auto pl-32">
            {
                (!articleisLoading && articleMap) && articleMap.map((i: createArticleData) => (
                    <FeedArticle key={i._id} articleData={i}  />
                ))
            }
            </div>
        </div>
    )
}