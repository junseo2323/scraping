import dummydata from '@/../data/testdata.json'
import Tag from './Tag'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'
import Modal from "react-modal"

import axios from 'axios'
import { ObjectId } from 'mongodb'
import { DefultInputbox } from './Inputbox'
import CreateTag from './CreateTag'
import useSWR, { mutate } from 'swr';
import Swal from 'sweetalert2'
import { SubmitHandler, useForm } from 'react-hook-form'

interface props {
    articleData : articleData,
    tagData : tagData
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

interface Articleprops {
    articleData : createArticleData,
    tagData : tagData
}

type tagData = [{
    color: string,
    tagname : string
}]

const Article:React.FC<Articleprops> = ({articleData,tagData}) => {
    const backgroundImage = articleData.image[0].url
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'
    
    const tagGenerator = () => {
        let resultTag = []
        for (let tmptag of tagData) {
            if(articleData.tag && articleData.tag.includes(tmptag.tagname)){
                resultTag.push(tmptag)
            }
        } 
        return resultTag
    }

    const tagList = tagGenerator()
    

    return(
        <Link href={articleData.url}>
            <div  className='w-80 ml-auto place-items-center'>
                <div className='w-[100%] h-64  overflow-hidden'>
                    <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                </div>
                <div className='grid grid-rows-[1.5fr_1.5fr_0.5fr_1fr] px-3 py-[20px]'>
                    <div className='grid grid-cols-[2fr_0.5fr_0.5fr] pb-7'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-2xl '>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400 w-[100%] h-14 overflow-clip'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px_70px_70px] gap-y-2'>
                        {
                            tagList.map((i)=>(
                                <Tag text={i.tagname} color={i.color} />
                            ))
                        }
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}

interface MiniArticleprops {
    articleData : createArticleData,
    tagData : tagData
}

const MiniArticle:React.FC<MiniArticleprops> = ({articleData,tagData}) => {
    const backgroundImage = articleData.image[0].url
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'

    const tagGenerator = () => {
        let resultTag = []
        for (let tmptag of tagData) {
            if(articleData.tag.includes(tmptag.tagname)){
                resultTag.push(tmptag)
            }
        } 
        return resultTag
    }

    const tagList = tagGenerator()

    const deleteButton = () => {
        Swal.fire({
            title: '삭제하시겠습니까?',
            text: '기록의 한페이지를 삭제합니다.',
            icon: 'warning',
            
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                        
         }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                axios.delete('api/delete-article',{data: {_id: articleData._id}})
                .then((res) => {console.log(res)})
                .catch((error) => {console.error(error)})               
               Swal.fire('삭제가 완료되었습니다.', '기록을 확인하세요!', 'success');
               mutate('api/get-article')
            }
         })

        
    }

    const [ismordal,setIsmordal] = useState<boolean>(false)

    return(
        <div className='relative drop-shadow-xl	bg-white w-60 h-[27rem] rounded-2xl'>
            <Link href={articleData.url} className='inline-block w-60 '>
            <div  className='w-60 h-32 place-items-center'>
                <div className='w-[100%] h-32  overflow-hidden'>
                    <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                </div>               
                <div className='w-[100%] grid-rows-[0.5fr_1fr_0.5fr_0.5fr] px-3 py-8'>
                    <div className='grid grid-cols-[1fr_0.5fr_0.5fr] pb-3'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-xl h-14 overflow-clip'>{articleData.title}</p>
                    <p className='font-light break-all text-sm text-gray-400 h-14 overflow-scroll scrollbar-hide'>{articleData.subtitle}</p>
                    <div className='py-2 overflow-scroll scrollbar-hide grid grid-cols-[70px_70px_70px] gap-y-2 h-14'>
                    {
                            tagList.map((i)=>(
                                <Tag text={i.tagname} color={i.color} />
                            ))
                        }                    
                    </div>
                </div>
                
                <div className='w-36 top-10 border-b-2 border-black m-auto' ></div>
            </div>
            </Link>
            <div className='absolute bottom-[20px] pl-4'>
                <button className='text-gray-400 font-thin' onClick={deleteButton}>삭제</button>
                <button className='text-gray-400 font-thin pl-[9rem]' onClick={()=>{setIsmordal(!ismordal)}}>수정</button>
            </div>
            <ModifyArticle ismordal={ismordal} setIsmordal={setIsmordal} articleData={articleData} />
        </div>
    )
}

interface ModifyArticleType {
    ismordal: boolean,
    setIsmordal: React.Dispatch<React.SetStateAction<boolean>>,
    articleData : createArticleData,
}

type Inputs = {
    title : string,
    subtitle : string
}




const ModifyArticle:React.FC<ModifyArticleType> = ({ismordal,setIsmordal,articleData}) => {
    const {data} = useSWR('api/get-tag')
    const [initaldata,setInitalData] = useState(articleData)
    const {register,handleSubmit,watch} = useForm<Inputs>()
    useEffect(() => {
        const subscirbe = watch((data, { name }) => {
            console.log(data, name)
            setInitalData((prevState) => ({
                ...prevState,
                title : data.title,
                subtitle : data.subtitle
            }))
    })
        return () => subscirbe.unsubscribe();
    }, [watch]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        Swal.fire({
            title: '수정하시겠습니까?',
            text: '기록의 한페이지를 수정합니다.',
            icon: 'warning',
            
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                        
         }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
               axios.put('api/modify-article',initaldata)
                .then((res) => {console.log(res)})
                .catch((error) => {console.log(error)})
               Swal.fire('수정이 완료되었습니다.', '수정된 기록을 확인하세요!', 'success');
               mutate('api/get-article')
               setIsmordal(false)
            }
         })
    }

    return(
        <div>
            {
                articleData &&
                <Modal isOpen={ismordal} className='m-auto mt-36 pl-5 pt-2 rounded-3xl drop-shadow-2xl w-[500px] h-[700px] bg-white'>
                    <p className='font-bold text-3xl'>수정하기</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DefultInputbox type='text' label='제목' defultValue={articleData.title} register={register('title')}/>
                        <DefultInputbox type='text' label='설명' defultValue={articleData.subtitle} register={register('subtitle')}/>
                        <CreateTag articletag={initaldata.tag} tagdata={data} setInitalData={setInitalData}/>
                        <button className='float-left text-lg'>수정</button>
                    </form>
                    <button className='float-right pr-5 text-lg' onClick={()=>{setIsmordal(false)}}>닫기</button>
                </Modal>
            }
        </div>
    )
}


export  {Article,MiniArticle}