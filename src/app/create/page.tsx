'use client'

import { Article } from "@/components/article";
import Button from "@/components/Button";
import CreateTag from "@/components/CreateTag";
import { Inputbox, DefultInputbox } from "@/components/Inputbox";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { fetcher } from "@/utils/api";
import { useRouter } from "next/navigation";
import {createArticleData,articleData} from "@/types/type";
import dynamic from 'next/dynamic';

const ArticleEditor = dynamic(() => import('@/components/ArticleEditor'), { ssr: false });

//Type
type Inputs = {
    url: string,
    title: string,
    subtitle: string,
}

//CreateArticle
export default function createArticle() {
    const [url, setUrl] = useState<string>("");
    const { data } = useSWR('api/get-metadata?url=' + url, fetcher);
    const [windowState, setWindowState] = useState('select');

    return (
        <div>
            <div className="px-5 md:px-80 pt-10">
                {windowState === 'select' && <SelectType setWindowState={setWindowState} />}
                {windowState === 'write' && <Write setWindowState={setWindowState} />}
                {windowState === 'online' && <Online setWindowState={setWindowState} setUrl={setUrl} />}
                {windowState === 'online-input' && <OnlineInput setWindowState={setWindowState} articleData={data} />}
            </div>
        </div>
    )
}

//SelectType
interface SelectTypeProps {
    setWindowState: (value: string) => void
}

const SelectType: React.FC<SelectTypeProps> = ({ setWindowState }) => {
    const onClickOnline = () => {
        setWindowState('online')
    }
    const onClickWrite = () => {
        setWindowState('write')
    }
    return (
        <div>
            <p className="font-black text-3xl">어떤 기록을 기록하시나요 ?</p>
            <p className="font-light text-sm pt-1">무엇을 선택해야 할지 모르겠어요</p>
            <div className="grid grid-cols-2 place-items-center" >
                <div className="pt-10" onClick={onClickOnline}>
                    <img src="img/create-article-img/online.png" className="w-[30vw]" />
                    <p className="pt-10 font-bold text-3xl text-center">온라인 기록</p>
                </div>
                <div className="pt-10" onClick={onClickWrite}>
                    <img src="img/create-article-img/offline.png" className="w-[30vw]" />
                    <p className=" font-bold pt-8 text-3xl text-center">손글씨 기록</p>
                </div>
            </div>
        </div>
    )
}

//Write
interface WriteTypeProps {
    setWindowState: (value: string) => void
}


const Write: React.FC<WriteTypeProps> = () => {

    return (
        <div>
            <p className="font-black text-3xl">새로운 기록물 만들기</p>
            <p className="font-light text-sm pt-1">어떻게 해야할지 모르겠어요</p>
            <ArticleEditor initialValue=''/>
        </div>
    )
}

//Online
interface OnlineTypeProps {
    setWindowState: (value: string) => void,
    setUrl: (value: any) => void
}


const Online: React.FC<OnlineTypeProps> = ({ setWindowState, setUrl }) => {

    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setUrl(data.url)
        setWindowState('online-input')
    }

    return (
        <div>
            <p className="font-black text-3xl">온라인 기록물 만들기</p>
            <p className="font-light text-sm pt-1">어떻게 해야할지 모르겠어요</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputbox type="text" label='URL 입력하기' register={register("url")} />
                <div className="float-right mt-32">
                    <Button text='생성하기' />
                </div>
            </form>
        </div>
    )
}

//onlineInput
interface OnlineInputTypeProps {
    setWindowState: (value: string) => void,
    articleData: { data: articleData }
}

const OnlineInput: React.FC<OnlineInputTypeProps> = ({ setWindowState, articleData }) => {
    const router = useRouter();
    const { user } = useAuth();

    const { register, handleSubmit, setValue, watch } = useForm<Inputs>()
    const { data, error, isLoading, mutate } = useSWR('api/get-tag/' + user?._id, fetcher)

    const [initaldata, setInitaldata] = useState<createArticleData>({
        _id: '',
        url: "",
        image: [{ url: "" }],
        creator: "",
        title: "",
        subtitle: "",
        flatform: "",
        user: "",
        tag: [""]
    })

    useEffect(() => {
        const subscirbe = watch((data, { name }) => {
            setInitaldata((prevState) => ({
                ...prevState,
                title: data.title,
                subtitle: data.subtitle
            }))
        })
        return () => subscirbe.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (articleData) {
            setValue('title', articleData.data.title)
            setValue('subtitle', articleData.data.subtitle)
            setInitaldata({
                _id: articleData.data._id,
                url: articleData.data.url,
                image: articleData.data.image,
                creator: user?.nickname || '',
                title: articleData.data.title,
                subtitle: articleData.data.subtitle,
                flatform: articleData.data.flatform,
                user: user?._id || '',
                tag: [""]
            })
        }
    }, [articleData])

    const onSubmit: SubmitHandler<Inputs> = () => {
        axios.post('api/post-article', initaldata)
            .then((res) => { 
                
            })
            .catch((error) => { console.error(error) })
        setWindowState('online');
        router.push('/home')
    }

    return (
        <div>
            <p className="font-black text-3xl">온라인 기록물 만들기</p>
            <p className="font-light text-sm pt-1">어떻게 해야할지 모르겠어요</p>
            <div className="grid grid-cols-[2fr_1fr]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DefultInputbox type="text" defultValue={initaldata.title ?? ''} label='제목' register={register("title")} />
                    <DefultInputbox type="text" defultValue={initaldata.subtitle ?? ''} label='설명' register={register("subtitle")} />
                    <CreateTag articletag={initaldata.tag} tagdata={data} setInitalData={setInitaldata} />
                    <div className="float-right mt-32">
                        <button
                            type="submit"
                            className="my-5 w-44 h-16 rounded-xl bg-[#6083FF] font-black text-3xl text-white">
                            생성하기
                        </button>
                    </div>
                </form>

                <div className="p-5">
                    {
                        (initaldata && data) &&
                        <Article
                            articleData={initaldata}
                            tagData={data}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
