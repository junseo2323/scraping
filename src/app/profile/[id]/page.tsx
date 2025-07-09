'use client'

import { MiniArticle } from "@/components/article";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/utils/api";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useSWR from "swr";

interface user {
    username: string,
    email: string, 
    subtitle: string
}

export default function Profile() {
    const router = useRouter();

    const {user,configToken} = useAuth();
    const { id } = useParams() as { id: string };

    const { data: articleData, error: articleError, isLoading: articleisLoading } = useSWR(id ? '/api/get-article/' + id : null, fetcher)
    const { data: tagData, error: tagError, isLoading: tagisLoading } = useSWR(id ? '/api/get-tag/' + id : null, fetcher)


    const [users, setUsers] = useState<user>();
    const [countArticle, setCountArticle] = useState<number>();
    const [isModify, setIsModify] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [subtitle, setSubtitle] = useState<string>('');


    const doubleClickhandle = () => {
        if(user?._id === id){
            setIsModify(true);
        }
    }

    const deleteFunction = async() => {
        const body = {_id: user?._id};
        const res = await axios.post('/api/delete-user',body);
    }

    const onDeleteHandle = () => {
        //Tag, Article, Write, user에서 흔적 지우기 -> 그냥 user에서 처리하자
        Swal.fire({
            title: '탈퇴하시겠습니까?',
            text: '당신의 노트를 삭제합니다.',
            icon: 'warning',

            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            cancelButtonText: '취소', // cancel 버튼 텍스트 지정

        }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                deleteFunction();                
                router.push('/start');
            }
        })

        
    }

    const onSubmitHandle = async() => {
        const body = {
            userId : id,
            username : username === ''?users?.username:username,
            subtitle : subtitle === ''?users?.subtitle:subtitle
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
            setUsers({
                username: res.username,
                email: res.email, 
                subtitle: res.subtitle        
            })
        }

        getUser();

    },[isModify])

    return(
        <div className="grid grid-rows-[0.5fr_1fr_0.1fr] px-5">
            <div className="w-[80vw] md:w-[40vw] border-r-2 border-[#D0D0D0]">
                <p className="text-[#D0D0D0] font-thin text-sm">더블클릭하면 수정할 수 있어요.</p>
                <p>기록한 글 {countArticle}개</p>
                {
                    isModify ? 
                        <div className="grid gird-rows-3">
                            <input 
                                onChange={(e)=>{
                                    setUsername(e.target.value);
                                }}
                                defaultValue={users?.username}
                                className="text-[48px] font-bold w-[70vw] md:w-[30vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                            />
                            <input 
                                onChange={(e)=>{
                                    setSubtitle(e.target.value);
                                }}
                                defaultValue={users?.subtitle}
                                className="text-[32px] font-bold w-[70vw] md:w-[30vw] border-b-2 border-gray-600 bg-transparent text-black text-lg py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                            />
                            <button 
                            className="pl-32 md:pl-10 font-bold text-[#ffa806]"
                            onClick={onSubmitHandle}>저장하기</button>
                        </div>:
                        <>
                            <p className="text-[48px] font-bold" onDoubleClick={doubleClickhandle}>{users?.username}</p>
                            <p className="text-[32px] font-bold" onDoubleClick={doubleClickhandle}>{users?.subtitle}</p>
                        </>
                }
                <p>{users?.email}</p>
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
            <button 
            className="font-bold text-[#ffa806] text-left"
            onClick={onDeleteHandle}>탈퇴하기</button>
        </div>
    )
}