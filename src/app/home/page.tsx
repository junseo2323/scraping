"use client"

import {MiniArticle} from "@/components/Article"
import Logo from "@/components/Logo"
import dummydata from "@/../data/testdata.json"
import useSWR from "swr"
import axios from 'axios'
import { useEffect, useState } from "react"

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function home() {
    const {data: articleData,error: articleError,isLoading: articleisLoading} = useSWR('api/get-article', fetcher)
    const {data: tagData,error: tagError,isLoading: tagisLoading} = useSWR('api/get-tag', fetcher)
    useEffect(() => {
        // Fetch data or perform some action here
    }, [articleData]); // Dependency array

    
    return(
        <div>
            <Logo />
            <div id="main-article" className="pl-8 pt-3">
                <p>나의 기록들</p>
                <div id="my-article" className="py-5 grid grid-cols-auto-fit gap-x-[70px] gap-y-[30px]">
                    {
                        (!articleisLoading && !tagisLoading) && 
                        articleData.map((i: any) => (
                            <MiniArticle key={i.id} articleData={i} tagData={tagData}  />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}