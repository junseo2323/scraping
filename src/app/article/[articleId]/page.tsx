'use client'

import { useParams } from 'next/navigation';
import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import '../../globals.css';
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import Modal from "react-modal"
 
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

const articleIdFetcher = async(url: string) => {
    try{
        const res = await axios.get('/api/get-articleId?url='+url);
        return res.data;
    }catch(err){
        console.error(err);
    }
}

const fetchArticleById = async(id: string) => {
    try{
        const res = await axios.get(`/api/write/${id}`);
        return res.data;
    }catch(error){
        console.log(error);
    }
}

export default function WritenArticle(){
    const {user} = useAuth();
    const { articleId } = useParams() as { articleId: string };

    const url = process.env.NEXT_PUBLIC_SCRAPING_URL+'/article/'+articleId;

    
    
    const [articleData, setArticleData] = useState();
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    const [isuserlike, setIsuserlike] = useState<boolean>(false);
    const [likecount, setLikecount] = useState<number>(0);
    const [commentcount, setCommentcount] = useState<number>(0);
    const [comments, setComments] = useState<any[]>([]);

    const onClickHandle = async () => {
        if (!user?._id || !articleData) return;
        if (isuserlike) {
            await unlikeFetcher(articleData , user._id);
            setIsuserlike(false);
            setLikecount(prev => prev - 1);
        } else {
            await likeFetcher(articleData, user._id);
            setIsuserlike(true);
            setLikecount(prev => prev + 1);
        }
    }

    const refetchComments = async () => {
        if (!articleData) return;
        const likeData = await api.get(`/api/get-like?articleId=${articleData}`);
        if (likeData) {
            const comments = likeData.comment || [];
            setComments(comments);
            setCommentcount(comments.length);
        }
    };

    const fetchUsernames = async (id: string) => {
        try {
            const res = await api.get('/api/get-username?userId=' + id);
            setWriter(res.username)
        } catch (error) {

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!articleId) return;

            // Fetch article data to get the article's internal ID
            const articleIdRes = await articleIdFetcher(url);
            const internalArticleId = articleIdRes.data._id;
            setArticleData(internalArticleId);

            // Fetch article details and likes/comments in parallel
            const [article, likeData] = await Promise.all([
                fetchArticleById(articleId),
                api.get(`/api/get-like?articleId=${internalArticleId}`)
            ]);

            // Process article details
            if (article) {
                setContent(article.content);
                setTitle(article.title);
                fetchUsernames(article.writer);
                const date = new Date(article.createdAt);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const formatted = `${year}년 ${month}월 ${day}일`;
                setCreatedAt(formatted);
            }

            // Process likes and comments
            if (likeData) {
                if (user?._id && likeData.liker.includes(user._id)) {
                    setIsuserlike(true);
                }
                setLikecount(likeData.liker ? likeData.liker.length : 0);
                const comments = likeData.comment || [];
                setComments(comments);
                setCommentcount(comments.length);
            } else {
                setLikecount(0);
                setComments([]);
                setCommentcount(0);
            }
        };

        fetchData();
    }, [articleId, user?._id]);

    const viewerRef = useRef<Viewer>(null);
   
    return(
        <div className="mx-auto grid gird-cols-[1fr_0.4fr_0.5fr_2fr] gap-5">
            <div>
                <button onClick={onClickHandle}>좋아요 {likecount}</button>
                <button className='pl-5'
                    onClick={() => {
                        
                    }}>댓글 {commentcount}</button>
            </div>
            <p className="font-bold text-4xl">{title}</p>
            <div className="grid grid-cols-[0.1fr_1fr]">
                <p className="font-bold">{writer}</p>
                <p className="font-thin">{createdAt}</p>
            </div>
            <div className="grid grid-cols-[0.2fr_0.2fr_0.2fr]">
                <p>태그1</p>
                <p>태그2</p>
                <p>태그3</p>
            </div>
            <div className="grid gird-rows-2">
                <div>
                    <Viewer
                        key={content}
                        ref={viewerRef}
                        initialValue={content}
                    />
                </div>
                <div>
                    <Comment
                        articleId={articleData || ''}
                        comments={comments}
                        userId={user?._id || ''}
                        refetch={refetchComments}
                    />
                </div>
            </div>
        </div>
    )
}

const commentFetcher = async (articleId: string, liker: string, comment: string) => {
    try {
        const requestBody = {
            type: 'comment',
            articleId: articleId,
            userId: liker,
            commentText: comment
        };
        await api.patch('/api/patch-like', requestBody);
    } catch (error) {
        console.error(error);
    }
}

interface CommentArticleType {
    articleId: string,
    comments: any,
    userId: string,
    refetch: () => void;
}


const Comment: React.FC<CommentArticleType> = ({ articleId,comments, userId, refetch }) => {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState<string>('');
    const [usernames, setUsernames] = useState<Record<string, string>>({});

    const onClickHandle = async () => {
        if (!userId) return;
        await commentFetcher(articleId, userId, newComment);
        setNewComment('');
        refetch();
    }

    const onDeleteHandle = async (commentId: string) => {
        if (!userId) return;
        try {
            const body = {
                type: 'comment',
                commentId: commentId,
                articleId: articleId
            }
            const result = await api.patch('/api/delete-like', body);
        } catch (error) {
            console.error(error);
        }
        refetch();
    }
    useEffect(() => {
        const fetchUsernames = async () => {
            const newUsernames: Record<string, string> = {};
            for (const comment of comments) {
                const id = comment.userId;
                if (!usernames[id]) {
                    try {
                        const res = await api.get('/api/get-username?userId=' + id);
                        newUsernames[id] = res.username;
                    } catch (error) {
                        newUsernames[id] = "존재하지 않는 사용자.";
                    }
                }
            }
            setUsernames((prev) => ({ ...prev, ...newUsernames }));
        };

        if (comments?.length) fetchUsernames();
    }, [comments]);

    interface ModifyModalProps {
        comment: string;
        commentId: string;
    }

    const ModifyModal: React.FC<ModifyModalProps> = ({ comment, commentId }) => {
        const [newComment, setNewComment] = useState<string>(comment);
        const [ismodifymordal, setIsmodifymordal] = useState<boolean>(false);

        const onClickHandle = async () => {
            const body = {
                commentId: commentId,
                articleId: articleId,
                type: 'comment',
                userId: user?._id,
                commentText: newComment
            }

            console.log(body);


            try {
                const res = await api.patch('/api/modify-like', body);
                setIsmodifymordal(false);
                refetch();
            } catch (error) {
                console.error(error);
            }
        }

        if (!ismodifymordal) return (
            <button
                onClick={() => { setIsmodifymordal(true) }}
            >
                수정
            </button>
        )

        return (
            <div>
                <Modal isOpen={ismodifymordal}
                    className='select-none m-auto mt-[21vh] pl-5 pt-2 rounded-3xl drop-shadow-2xl w-[50vw] h-[25vh] bg-white'>
                    댓글수정
                    <div className="relative pt-4 mt-10 w-1/2">
                        <input
                            type='text'
                            className="w-[40vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                            defaultValue={comment}
                            placeholder='댓글'
                            id='댓글'
                            name='댓글'
                            onChange={(e) => {
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
                            className="absolute w-[40vw] top-0 left-0 text-gray-300 text-ms text-bold transition-all duration-200  peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-4xl peer-placeholder-shown:font-semibold peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-[#FFAA55] peer-focus:text-sm peer-focus:font-normal"
                        >
                            댓글
                        </label>
                    </div>
                    <div className='grid grid-cols-2'>
                        <p className='select-none' onClick={() => { setIsmodifymordal(false) }}>돌아가기</p>
                        <button
                            onClick={onClickHandle}
                            className="float-right mr-4 my-5 w-20 md:w-36 text-sm md:text-3xl md:h-16 rounded-xl bg-[#6083FF] font-black  text-white">
                            작성하기
                        </button>
                    </div>
                </Modal>
            </div>
        )
    }

    return(
        <div>
        <div className='m-auto mt-12 pl-5 pt-2 rounded-3xl w-[80vw] h-[85vh] bg-white'>
            <div className='grid grid-cols-[2fr_1fr]'>
                <div className="relative pt-4 mt-10 w-1/2">
                    <input
                        type='text'
                        className="w-[50vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                        value={newComment}
                        placeholder='댓글'
                        id='댓글'
                        name='댓글'
                        onChange={(e) => {
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
                    className="select-none my-5 w-20 md:w-36 text-sm md:text-3xl md:h-16 rounded-xl bg-[#6083FF] font-black  text-white">
                    작성하기
                </button>
            </div>
            <div className='h-[55vh] overflow-y-scroll'>
                {
                    comments && comments.map((i: any) => (
                        <div
                            id={i.commentId}
                            className='grid grid-cols-[2fr_1fr] h-16 mt-3 shadow-sm rounded-md'>
                            <p
                                className='text-lg font-normal ml-2'
                            >{i.commentText}</p>
                            <div>
                                <p className='text-sm select-none'>{usernames[i.userId]}</p>
                                <div className='grid grid-cols-2 w-20 select-none'>
                                    <button
                                        onClick={() => { onDeleteHandle(i.commentId) }}
                                    >삭제</button>
                                    <ModifyModal comment={String(i.commentText)} commentId={String(i.commentId)} />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    </div>
    )
}