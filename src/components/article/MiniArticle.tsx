import Tag from '../Tag'
import Link from 'next/link'
import React, { useState } from 'react'
import { api } from '@/utils/api';
import { mutate } from 'swr';
import Swal from 'sweetalert2'
import { useAuth } from '@/context/AuthContext'
import { createArticleData, tagData } from "@/types/type"
import ModifyArticle from './ModifyArticle'

interface MiniArticleprops {
    articleData: createArticleData,
    tagData: tagData
}

const MiniArticle: React.FC<MiniArticleprops> = ({ articleData, tagData }) => {
    const { user } = useAuth();
    const backgroundTmp = Array.isArray(articleData.image) 
    ? articleData.image[0]?.url || '/img/article/default.jpg' 
    : articleData.image || '/img/article/default.jpg';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`
    const [ismordal, setIsmordal] = useState<boolean>(false);

    const tagGenerator = () => {
        if (!tagData) return;
        let resultTag = []
        for (let tmptag of tagData) {
            if (articleData.tag.includes(tmptag.tagname)) {
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
                api.delete('api/delete-article', { _id: articleData._id })
                    .then((res) => {

                    })
                    .catch((error) => { console.error(error) })
                Swal.fire('삭제가 완료되었습니다.', '기록을 확인하세요!', 'success');
                mutate('api/get-article/' + user?._id);
            }
        })


    }

   

    return (
        <div className='relative drop-shadow-xl	bg-white w-60 h-[27rem] rounded-2xl'>
            <Link href={articleData.url} className='inline-block w-60 '>
                <div className='w-60 h-32 place-items-center'>
                    <div className='w-[100%] h-32  overflow-hidden'>
                        <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                    </div>
                    <div className='w-[100%] grid-rows-[0.5fr_1fr_0.5fr_0.5fr] px-3 py-8'>
                        <div className='grid grid-cols-[1.5fr_0.5fr] pb-3'>
                            <img className='py-2' src={flatformImage} width={32} />
                            <Link href={'/profile/'+articleData.user} className='py-2.5 justify-self-center text-sm'>
                                <p className='pt-[1.5px]'>{articleData.creator}</p>
                            </Link>
                        </div>
                        <p className='font-semibold text-xl h-14 overflow-clip'>{articleData.title}</p>
                        <p className='font-light break-all text-sm text-gray-400 h-14 overflow-scroll scrollbar-hide'>{articleData.subtitle}</p>
                        <div className='py-2 overflow-scroll scrollbar-hide grid grid-cols-[70px_70px_70px] gap-y-2 h-14'>
                            {
                                tagList && tagList.map((i) => (
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
                <button className='text-gray-400 font-thin pl-[9rem]' onClick={() => { setIsmordal(!ismordal) }}>수정</button>
            </div>
            <ModifyArticle ismordal={ismordal} setIsmordal={setIsmordal} articleData={articleData} />
        </div>
    )
}

export default MiniArticle;