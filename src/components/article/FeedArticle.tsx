import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext'
import { createArticleData } from "@/types/type"
import CommentArticle from './CommentArticle'

interface FeedArticleprops {
    articleData: createArticleData
}

const likeFetcher = async (articleId: string, liker: string) => {
    try {
        const requestBody = {
            type: 'like',
            articleId: articleId,
            userId: liker
        };
        await api.patch('/api/patch-like', requestBody);
    } catch (error) {
        console.error(error);
    }
}

const unlikeFetcher = async (articleId: string, liker: string) => {
    try {
        const requestBody = {
            type: 'like',
            articleId: articleId,
            userId: liker
        };
        await api.patch('/api/delete-like', requestBody);
    } catch (error) {
        console.error(error);
    }
}


const FeedArticle: React.FC<FeedArticleprops> = ({ articleData }) => {
    const { user } = useAuth();

    const [isuserlike, setIsuserlike] = useState<boolean>(false);
    const [likecount, setLikecount] = useState<number>(0);
    const [commentcount, setCommentcount] = useState<number>(0);
    const [comments, setComments] = useState();
    const [iscommentmordal, setIscommentmordal] = useState<boolean>(false)

    const fetchLikesAndComments = async () => {
        try {
            const data = await api.get(`/api/get-like?articleId=${articleData._id}`);

            if (!data) {
                return { likeCount: 0, comments: [] };
            }

            if (data.liker.includes(user?._id)) setIsuserlike(true);

            return {
                likeCount: data.liker ? data.liker.length : 0,
                comments: data.comment || []
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            return { likeCount: 0, comments: [], error: error };
        }
    };

    const backgroundTmp = Array.isArray(articleData.image) 
    ? articleData.image[0]?.url || '/img/article/default.jpg' 
    : articleData.image || '/img/article/default.jpg';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`

    const likeHandle = async () => {
        const { likeCount, comments, error } = await fetchLikesAndComments();
        setLikecount(likeCount);
        setComments(comments);
        setCommentcount(comments.length);
    }

    const onClickHandle = async () => {
        if (!user?._id) return;
        if (isuserlike) {
            await unlikeFetcher(articleData._id, user._id);
            setIsuserlike(false);
        } else {
            await likeFetcher(articleData._id, user._id);
            setIsuserlike(true);
        }
        likeHandle();
    }

    useEffect(() => {
        likeHandle();
    }, []);

    useEffect(() => {
        likeHandle();
    }, [user]);

    return (
        <div className='relative drop-shadow-xl	bg-white w-60 h-[27rem] rounded-2xl'>
            <Link href={articleData.url} className='inline-block w-60 '>
                <div className='w-60 h-32 place-items-center'>
                    <div className='w-[100%] h-32  overflow-hidden'>
                        <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                    </div>
                    <div className='w-[100%] grid-rows-[0.5fr_1fr_0.5fr_0.5fr] px-3 py-8'>
                        <div className='grid grid-cols-[1fr_0.5fr_0.5fr] pb-3'>
                            <img className='py-2' src={flatformImage} width={32} />
                            <div className='bg-[#D9D9D9] rounded-full w-10 h-10' />
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
                    onClick={() => {
                        setIscommentmordal(true);
                    }}>댓글 {commentcount}</button>
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

export default FeedArticle;