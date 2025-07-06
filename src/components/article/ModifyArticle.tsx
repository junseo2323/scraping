import React, { useEffect, useState } from 'react'
import Modal from "react-modal"
import { api } from '@/utils/api';
import useSWR, { mutate } from 'swr';
import Swal from 'sweetalert2'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { createArticleData } from "@/types/type"
import { DefultInputbox } from '../Inputbox'
import CreateTag from '../CreateTag'

interface ModifyArticleType {
    ismordal: boolean,
    setIsmordal: React.Dispatch<React.SetStateAction<boolean>>,
    articleData: createArticleData,
}

type Inputs = {
    title: string,
    subtitle: string
}

const ModifyArticle: React.FC<ModifyArticleType> = ({ ismordal, setIsmordal, articleData }) => {
    const { user } = useAuth();
    const { data } = useSWR('api/get-tag/' + user?._id);
    const [initaldata, setInitalData] = useState(articleData);
    const { register, handleSubmit, watch } = useForm<Inputs>();
    useEffect(() => {
        const subscirbe = watch((data, { name }) => {
            setInitalData((prevState) => ({
                ...prevState,
                title: data.title,
                subtitle: data.subtitle
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
                api.put('api/modify-article', initaldata)
                    .then((res) => {

                    })
                    .catch((error) => { console.error(error) })
                Swal.fire('수정이 완료되었습니다.', '수정된 기록을 확인하세요!', 'success');
                mutate('api/get-article/' + user?._id);
                setIsmordal(false);
            }
        })
    }

    return (
        <div>
            {
                articleData &&
                <Modal isOpen={ismordal}
                    className='m-auto mt-12 pl-5 pt-2 rounded-3xl drop-shadow-2xl w-[80vw] h-[85vh] bg-white'>
                    <p className='font-bold text-3xl'>수정하기</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DefultInputbox type='text' label='제목' defultValue={articleData.title || ''} register={register('title')} />
                        <DefultInputbox type='text' label='설명' defultValue={articleData.subtitle || ''} register={register('subtitle')} />
                        <CreateTag articletag={initaldata.tag} tagdata={data} setInitalData={setInitalData} />
                        <button className='float-left text-lg'>수정</button>
                    </form>
                    <button className='float-right pr-5 text-lg' onClick={() => { setIsmordal(false) }}>닫기</button>
                </Modal>
            }
        </div>
    )
}

export default ModifyArticle;