import React, { useEffect, useState } from 'react'
import Modal from "react-modal"
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext'

interface CommentArticleType {
    iscommentmordal: boolean,
    setIscommentmordal: React.Dispatch<React.SetStateAction<boolean>>,
    articleId: string,
    articleTitle: string,
    comments: any,
    userId: string,
    likeHandle: any

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


const CommentArticle: React.FC<CommentArticleType> = ({ iscommentmordal, setIscommentmordal, articleId, articleTitle, comments, userId, likeHandle }) => {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState<string>('');
    const [usernames, setUsernames] = useState<Record<string, string>>({});

    const onClickHandle = async () => {
        if (!userId) return;
        await commentFetcher(articleId, userId, newComment);
        setNewComment('');
        likeHandle();
    }

    const onDeleteHandle = async (commentId: string) => {
        if (!userId) return;
        try {
            const body = {
                type: 'comment',
                commentId: commentId,
                articleId: articleId
            }
            const result = await api.patch('api/delete-like', body);
        } catch (error) {
            console.error(error);
        }
        likeHandle();
    }


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

            try {
                const res = await api.patch('api/modify-like', body);
                setIsmodifymordal(false);
                likeHandle();
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

    return (
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
                                    {i.userId === user?._id && <div className='grid grid-cols-2 w-20 select-none'>
                                        <button
                                            onClick={() => { onDeleteHandle(i.commentId) }}
                                        >삭제</button>
                                        <ModifyModal comment={String(i.commentText)} commentId={String(i.commentId)} />
                                    </div>}
                                </div>
                            </div>
                        ))
                    }
                </div>

                <button className='select-none' onClick={() => { setIscommentmordal(false) }}>돌아가기</button>
            </Modal>
        </div>
    )
}

export default CommentArticle;