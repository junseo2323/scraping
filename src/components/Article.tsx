import dummydata from '@/../data/testdata.json'
import Tag from './Tag'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'
import Modal from "react-modal"

import axios from 'axios'
import { DefultInputbox, Inputbox } from './Inputbox'
import CreateTag from './CreateTag'
import useSWR, { mutate } from 'swr';
import Swal from 'sweetalert2'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import {createArticleData,tagData} from "@/types/type"
import { fetcher } from '@/utils/api'
import Button from './Button'


interface Articleprops {
    articleData : createArticleData,
    tagData : tagData
}



const Article:React.FC<Articleprops> = ({articleData,tagData}) => {
    const backgroundTmp = articleData.image[0].url || articleData.image || '';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`

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
    const {user} = useAuth();
    const backgroundTmp = articleData.image[0].url || articleData.image || '';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`
    
    const tagGenerator = () => {
        if(!tagData) return;
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
                .then((res) => {
                    
                })
                .catch((error) => {console.error(error)})               
               Swal.fire('삭제가 완료되었습니다.', '기록을 확인하세요!', 'success');
               mutate('api/get-article/'+user?._id);
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
                            tagList&&tagList.map((i)=>(
                                <Tag key={i.tagname} text={i.tagname} color={i.color} />
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


interface FeedArticleprops {
    articleData : createArticleData
}


type Comment = {
    userid: string;  // User who commented
    text: string;    // Comment text
};

const likeFetcher = async(articleId:string, liker:string) => {
    try{
        const requestBody = {
            type: 'like',
            articleId: articleId,
            userId: liker
        };
        await axios.patch('/api/patch-like',requestBody);
    }catch(error){
        console.error(error);
    }
}



const FeedArticle:React.FC<FeedArticleprops> = ({articleData}) => {
    const {user} = useAuth();

    const [likecount, setLikecount] = useState<number>(0);
    const [comments, setComments] = useState();
    const [iscommentmordal,setIscommentmordal] = useState<boolean>(false)

    const fetchLikesAndComments = async () => {
        try {
          const response = await axios.get(`/api/get-like?articleId=${articleData._id}`);
      
          const data = response.data;

          if (!data) {
            return { likeCount: 0, comments: [] };
          }
      
          return {
            likeCount: data.liker ? data.liker.length : 0,
            comments: data.comment || []
          };
        } catch (error) {
          console.error('Error fetching data:', error);
          return { likeCount: 0, comments: [], error: error };
        }
    };
      
    const backgroundTmp = articleData.image[0].url || articleData.image || '';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`

    const likeHandle = async() => {
        const { likeCount, comments, error } = await fetchLikesAndComments();
        setLikecount(likeCount);  
        setComments(comments);  
    }

    const onClickHandle = async() => {
        if (!user?._id) return;  
        await likeFetcher(articleData._id, user._id); 
        likeHandle();
    }

    useEffect(()=>{
        likeHandle();
    },[])
    
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

                </div>
                
                <div className='w-36 top-10 border-b-2 border-black m-auto' ></div>
            </div>
            </Link>
            <div className='absolute bottom-[20px] pl-4'>
                <button onClick={onClickHandle}>좋아요 {likecount}</button>
                <button className='pl-5'
                        onClick={()=>{
                            setIscommentmordal(true);
                        }}>댓글</button>
            </div>
            <CommentArticle 
                iscommentmordal={iscommentmordal} 
                setIscommentmordal={setIscommentmordal}
                articleId={articleData._id}
                articleTitle={articleData.title || ''}
                comments={comments}
                userId={user?._id || ''}
                likeHandle={likeHandle}
            />
        </div>
    )
}

interface CommentArticleType {
    iscommentmordal: boolean,
    setIscommentmordal: React.Dispatch<React.SetStateAction<boolean>>,
    articleId: string,
    articleTitle: string,
    comments: any,
    userId: string,
    likeHandle: any

}

const commentFetcher = async(articleId:string,liker: string , comment:string) => {
    try{
        const requestBody = {
            type: 'comment',
            articleId: articleId,
            userId: liker,
            content: comment
        };
        await axios.patch('/api/patch-like',requestBody);
    }catch(error){
        console.error(error);
    }
}


const CommentArticle:React.FC<CommentArticleType> = ({iscommentmordal,setIscommentmordal,articleId,articleTitle,comments,userId,likeHandle}) => {
    const [newComment, setNewComment] = useState<string>('');
    
    const onClickHandle = async() => {
        if (!userId) return;  
        await commentFetcher(articleId,userId, newComment);
        setNewComment('');
        likeHandle();
    }   
    
    const [usernames, setUsernames] = useState<Record<string, string>>({});

        useEffect(() => {
            const fetchUsernames = async () => {
                const newUsernames: Record<string, string> = {};
                for (const comment of comments) {
                    const id = comment.userId;
                    if (!usernames[id]) {
                        try {
                            const res = await axios.get('/api/get-username?userId=' + id);
                            newUsernames[id] = res.data.username;
                        } catch (error) {
                            newUsernames[id] = "존재하지 않는 사용자.";
                        }
                    }
                }
                setUsernames((prev) => ({ ...prev, ...newUsernames }));
            };

            if (comments?.length) fetchUsernames();
        }, [comments]);

    return(
        <div>
            <Modal isOpen={iscommentmordal} 
                    className='m-auto mt-12 pl-5 pt-2 rounded-3xl drop-shadow-2xl w-[80vw] h-[85vh] bg-white'>
                <p className='pt-5 font-bold text-xl'>[{articleTitle}]</p>
                <div className='grid grid-cols-[2fr_1fr]'>
                <div className="relative pt-4 mt-10 w-1/2">
                    <input
                        type='text'
                        className="w-[50vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                        value={newComment}
                        placeholder='댓글'
                        id='댓글'
                        name='댓글'
                        onChange={(e)=>{
                            setNewComment(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onClickHandle();   
                            }
                        }}
                        required
                    />
                    <label
                        htmlFor='댓글'
                        className="absolute w-[50vw] top-0 left-0 text-gray-300 text-ms text-bold transition-all duration-200  peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-4xl peer-placeholder-shown:font-semibold peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-[#FFAA55] peer-focus:text-sm peer-focus:font-normal"
                    >
                        댓글
                    </label>
                </div>
    
                <button
                    onClick={onClickHandle}
                    className="my-5 w-20 md:w-36 text-sm md:text-3xl md:h-16 rounded-xl bg-[#6083FF] font-black  text-white">
                    작성하기
                </button>
                </div>
                <div className='h-[55vh] overflow-y-scroll'>
                {
                    comments && comments.map((i: any)=>(
                            <div 
                                className='grid grid-cols-[2fr_1fr] h-16 mt-3 shadow-sm rounded-md'>
                                <p
                                    className='text-lg font-normal ml-2'
                                >{i.content}</p>
                                <div>
                                    <p className='text-sm'>{usernames[i.userId]}</p>
                                    <div className='grid grid-cols-2 w-20'>
                                        <button>삭제</button>
                                        <button>수정</button>
                                    </div>
                                </div>
                            </div>
                    ))
                }
                </div>

                <button onClick={()=>{setIscommentmordal(false)}}>돌아가기</button>
            </Modal>
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
    const {user} = useAuth();
    const {data} = useSWR('api/get-tag/'+user?._id);
    const [initaldata,setInitalData] = useState(articleData);
    const {register,handleSubmit,watch} = useForm<Inputs>();
    useEffect(() => {
        const subscirbe = watch((data, { name }) => {
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
                .then((res) => {
                    
                })
                .catch((error) => {console.error(error)})
               Swal.fire('수정이 완료되었습니다.', '수정된 기록을 확인하세요!', 'success');
               mutate('api/get-article/'+user?._id);
               setIsmordal(false);
            }
         })
    }

    return(
        <div>
            {
                articleData &&
                <Modal isOpen={ismordal} 
                    className='m-auto mt-12 pl-5 pt-2 rounded-3xl drop-shadow-2xl w-[80vw] h-[85vh] bg-white'>
                    <p className='font-bold text-3xl'>수정하기</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DefultInputbox type='text' label='제목' defultValue={articleData.title || ''} register={register('title')}/>
                        <DefultInputbox type='text' label='설명' defultValue={articleData.subtitle || ''} register={register('subtitle')}/>
                        <CreateTag articletag={initaldata.tag} tagdata={data} setInitalData={setInitalData}/>
                        <button className='float-left text-lg'>수정</button>
                    </form>
                    <button className='float-right pr-5 text-lg' onClick={()=>{setIsmordal(false)}}>닫기</button>
                </Modal>
            }
        </div>
    )
}

export  {Article,MiniArticle,FeedArticle}