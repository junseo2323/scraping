'use client'

import { MiniArticle } from "@/components/article";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/utils/api";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface user {
    username: string,
    email: string, 
    subtitle: string
}

export default function Profile() {
    const {configToken} = useAuth();
    const { id } = useParams() as { id: string };

    const { data: articleData, error: articleError, isLoading: articleisLoading } = useSWR(id ? '/api/get-article/' + id : null, fetcher)
    const { data: tagData, error: tagError, isLoading: tagisLoading } = useSWR(id ? '/api/get-tag/' + id : null, fetcher)


    const [user, setUser] = useState<user>();
    const [countArticle, setCountArticle] = useState<number>();
    const [isModify, setIsModify] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [subtitle, setSubtitle] = useState<string>('');


    const doubleClickhandle = () => {
        setIsModify(true);
    }

    const onSubmitHandle = async() => {
        const body = {
            userId : id,
            username : username === ''?user?.username:username,
            subtitle : subtitle === ''?user?.subtitle:subtitle
        };
        const res = await axios.patch('/api/patch-user',body);
        configToken();
        setIsModify(false);
    }

    useEffect(()=>{
        if(Array.isArray(articleData)){
            setCountArticle(articleData.length);
        }
    },[articleData])

    useEffect(()=>{
        const fetchUserById = async(id: string) => {
            try{
                const res = await axios.get('/api/get-user?userId='+id);
                return res.data;
            }catch(error){
                console.error(error);
            }
        }

        const getUser = async() => {
            const res = await fetchUserById(id);
            setUser({
                username: res.username,
                email: res.email, 
                subtitle: res.subtitle        
            })
        }

        getUser();

    },[isModify])

    return(
        <div className="grid grid-rows-[0.5fr_1fr]">
            <div className="w-[40vw] border-r-2 border-[#D0D0D0]">
                <p className="text-[#D0D0D0] font-thin text-sm">더블클릭하면 수정할 수 있어요.</p>
                <p>기록한 글 {countArticle}개</p>
                {
                    isModify ? 
                        <>
                            <input 
                                onChange={(e)=>{
                                    setUsername(e.target.value);
                                }}
                                defaultValue={user?.username}
                                className="text-[48px] font-bold w-[20vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                            />
                            <input 
                                onChange={(e)=>{
                                    setSubtitle(e.target.value);
                                }}
                                defaultValue={user?.subtitle}
                                className="text-[32px] font-bold w-[20vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                            />
                            <button 
                            className="pl-10 font-bold text-[#ffa806]"
                            onClick={onSubmitHandle}>저장하기</button>
                        </>:
                        <>
                            <p className="text-[48px] font-bold" onDoubleClick={doubleClickhandle}>{user?.username}</p>
                            <p className="text-[32px] font-bold" onDoubleClick={doubleClickhandle}>{user?.subtitle}</p>
                        </>
                }
                <p>{user?.email}</p>
            </div>

            <div className="py-5">
            <p>기록모음</p>
            <div id="my-article" 
                    style={{ maxWidth: '80vw' }}
                    className="py-5 flex gap-x-[70px] overflow-x-auto">
                    {
                        (!articleisLoading && !tagisLoading) && 
                        articleData.map((i: any) => (
                            <MiniArticle key={i._id} articleData={i} tagData={tagData}  />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}