"use client"

import { FeedArticle } from "@/components/Article";
import { fetcher } from "@/utils/api"
import { useEffect, useState } from "react"

const fetchArticle = () => {
    const res = fetcher('api/get-article');
    return res;
}
type articleData = {
    url : string,
    creator: string,
    title : string,
    subtitle: string,
    _id : string,
    flatform: string,
    tag : [string]
}
type createArticleData = {
    _id : string ,
    url : string,
    image: [{
        url:string
    }],
    creator: string,
    title : string | undefined,
    subtitle: string | undefined,
    flatform: string,
    tag : [string]
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
            <div className="flex flex-wrap gap-x-4 gap-y-7 pl-32">
            {
                (!articleisLoading && articleMap) && articleMap.map((i: createArticleData) => (
                    <FeedArticle key={i._id} articleData={i}  />
                ))
            }
            </div>
        </div>
    )
}