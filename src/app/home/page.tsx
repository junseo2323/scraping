"use client"

import {MiniArticle} from "@/components/Article"
import Logo from "@/components/Logo"
import dummydata from "@/../data/testdata.json"
import useSWR from "swr"
import axios from 'axios'
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import {Tag} from "@/utils/schema"

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const fetchArticle = (id: string, tag: string) => {
    const res = fetcher('api/get-article/'+id+"/"+tag);
    return res;
}

export default function home() {
    const {user} = useAuth();

    const {data: articleData,error: articleError,isLoading: articleisLoading} = useSWR('api/get-article/'+user?._id, fetcher)
    const {data: tagData,error: tagError,isLoading: tagisLoading} = useSWR('api/get-tag/'+user?._id, fetcher)
    
    const [tagArticlesMap, setTagArticlesMap] = useState<{[tagname:string]: any[]}>({});
    const [loadingTags, setLoadingTags] = useState<{ [tagname: string]: boolean }>({});

    const tagArticle = async(tagname: string) => {
        if(!user?._id) return;
        setLoadingTags(prev => ({ ...prev, [tagname]: true }));

        try{
            const res = await fetchArticle(user?._id,tagname);
            setTagArticlesMap(prev => ({ ...prev, [tagname]: res }));
        }catch(err) {
            return(<div>에러</div>);
        }finally {
            setLoadingTags(prev => ({ ...prev, [tagname]: false }));
        }
    }


    useEffect(() => {
        if (tagData && user?._id) {
          tagData.forEach((tag: Tag) => {
            tagArticle(tag.tagname);
          });
        }
      }, [tagData, user?._id]);

      return(
        <div className="pt-10 grid grid-rows-2">
            <div id="main-article" className="pl-8 pt-3">
                <p>나의 기록들</p>
                <div id="my-article" 
                    style={{ maxWidth: '100vw' }}
                    className="py-5 flex gap-x-[70px] overflow-x-auto">
                    {
                        (!articleisLoading && !tagisLoading) && 
                        articleData.map((i: any) => (
                            <MiniArticle key={i._id} articleData={i} tagData={tagData}  />
                        ))
                    }
                </div>
                <div id="tag-article" className="py-5 ml-42">
                    <p>태그별 기록들</p>
                    {
                        !tagisLoading && tagData?.map((tag: Tag) => (
                        <div>
                            <p className="py-5">{tag.tagname}</p>
                            <div key={tag.tagname} 
                            style={{ maxWidth: '100vw' }}
                            className="py-5 flex gap-x-[70px] overflow-x-auto">
                            {loadingTags[tag.tagname] && <p>로딩중...</p>}
                            {tagArticlesMap[tag.tagname]?.map((article: any) => (
                            <MiniArticle key={article._id} articleData={article} tagData={tagData} />
                            ))}
                            </div>
                        </div>
                        ))
                    }
                </div>
                
            </div>
        </div>
    )
}

