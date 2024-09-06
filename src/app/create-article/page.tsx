'use client'

import { Article } from "@/components/Article";
import Button from "@/components/Button";
import CreateTag from "@/components/CreateTag";
import {Inputbox, DefultInputbox} from "@/components/Inputbox";
import Logo from "@/components/Logo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function createArticle(request: Request) {
    const [url,setUrl] = useState<string>("")
    
    const [fetchingData, setFetchingData] = useState<articleData>()
    const {data,error,isLoading} = useSWR('api/get-metadata?url='+url, fetcher)

    useEffect(()=>{
        setFetchingData(data)
    },[url,data])
    
    const [windowState, setWindowState] = useState('online')

    return(
        <div>
            <Logo />
            <div className="px-32">
                {   windowState==='select' &&
                    <SelectType setWindowState={setWindowState}/>
                }
                {   windowState==='online' &&
                    <Online setWindowState={setWindowState} setUrl={setUrl}/>
                }
                {   windowState==='online-input' &&
                    <OnlineInput setWindowState={setWindowState} articleData={fetchingData}/>
                }
                
            </div>
        </div>
    )
}

interface SelectTypeProps {
    setWindowState: (value:string) => void
}

const SelectType:React.FC<SelectTypeProps> = ({setWindowState}) => {
    const onClick = () => {
        setWindowState('online')
    }
    return(
        <div>
            <p className="font-black text-3xl">어떤 기록을 기록하시나요 ?</p>
            <p className="font-light text-sm pt-1">무엇을 선택해야 할지 모르겠어요</p>
            <div className="grid grid-cols-2 place-items-center" onClick={onClick}>
                <div className="pt-10">
                    <img src="img/create-article-img/online.png" className="w-[30vw]"/>
                    <p className="pt-10 font-bold text-3xl text-center">온라인 기록</p>
                </div>
                <div className="pt-10">
                    <img src="img/create-article-img/offline.png" className="w-[30vw]"/>
                    <p className="pt-10 font-bold pt-8 text-3xl text-center">손글씨 기록</p>
                </div>
            </div>
        </div>
    )
}

type Inputs = {
    url: string,
    title: string,
    subtitle: string,
}
interface OnlineTypeProps {
    setWindowState: (value:string) => void,
    setUrl: (value:any) => void
}
const Online:React.FC<OnlineTypeProps> = ({setWindowState,setUrl}) => {
    const {
        register,
        handleSubmit
    } = useForm<Inputs>()
    
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setUrl(data.url)
        setWindowState('online-input')
    }

   

    return(
        <div>
            <p className="font-black text-3xl">온라인 기록물 만들기</p>
            <p className="font-light text-sm pt-1">어떻게 해야할지 모르겠어요</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputbox type="text" label='URL 입력하기' register={register("url")}/>
                <div className="float-right mt-32">
                    <Button text='생성하기' onClick={() => {return {}}}/>
                </div>
            </form>
        </div>
    )
}

type articleData = {
    url : string,
    creator: string,
    image: [{
        url:string
    }],
    title : string,
    subtitle: string,
    _id : string,
    flatform: string,
    tag : [string]
}

interface OnlineInputTypeProps {
    setWindowState: (value:string) => void,
    articleData: {data: articleData}
}
type createArticleData = {
    _id : string,
    url : string,
    image: [{
        url:string
    }],
    creator: string,
    title : string|undefined,
    subtitle: string|undefined,
    flatform: string,
    tag : [string]
}
const OnlineInput:React.FC<OnlineInputTypeProps> = ({setWindowState,articleData}) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch
    } = useForm<Inputs>()
    
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setWindowState('online-input')
    }

    const {data,error,isLoading,mutate} = useSWR('api/get-tag',fetcher)

    const [initaldata,setInitaldata] = useState<createArticleData>(
        {
            _id: '',
            url : "",
            image: [{url:""}],
            creator: "",
            title : "",
            subtitle: "",
            flatform: "",
            tag : [""]
        }
    )
    const watchedUsername = watch('title');

    useEffect(() => {
        const subscirbe = watch((data, { name }) => {
            console.log(data, name)
            setInitaldata((prevState) => ({
                ...prevState,
                title : data.title,
                subtitle : data.subtitle
            }))
        })
        return () => subscirbe.unsubscribe();
      }, [watch]);

    useEffect(()=>{
        if(articleData){
        setValue('title',articleData.data.title)
        setValue('subtitle',articleData.data.subtitle)
        setInitaldata({
            _id : articleData.data._id,
            url : articleData.data.url,
            image: articleData.data.image,
            creator: "testuser",
            title : articleData.data.title,
            subtitle: articleData.data.subtitle,
            flatform: articleData.data.flatform,
            tag : ["문화"]
        })
    }
    },[articleData])
    useEffect(()=>{console.log(initaldata)},[initaldata])

    const submit = () => {
        axios.post('api/post-article',initaldata)
            .then((res) => {console.log(res)})
            .catch((error) => {console.error(error)})
        setWindowState('online')
        return {}
    }
    return(
        <div>
            <p className="font-black text-3xl">온라인 기록물 만들기</p>
            <p className="font-light text-sm pt-1">어떻게 해야할지 모르겠어요</p>
            <div className="grid grid-cols-[2fr_1fr]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DefultInputbox type="text"  defultValue={initaldata.title ?? ''} label='제목' register={register("title")}/>
                    <DefultInputbox type="text"  defultValue={initaldata.subtitle ?? ''} label='설명' register={register("subtitle")}/>
                    <CreateTag articletag={initaldata.tag} tagdata={data} setInitalData={setInitaldata}/>
                    <div className="float-right mt-32">
                        <Button text='생성하기' onClick={submit}/>
                    </div>
                </form>

                <div className="p-5">
                
                {
                    (initaldata&&data) &&
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


/*
 
{data && 
                <>
                <p>제목 : {data.data.title}</p>
                <p>설명 : {data.data.subtitle}</p>
                <p>주소 : {data.data.url}</p>
                <p>플렛폼</p>
                <img  src={data.data.flatform} alt="flatform" />
                <p>사진</p>
                <img referrerPolicy="no-referrer" src={data.data.image[0].url}  />
                </>
            }
*/