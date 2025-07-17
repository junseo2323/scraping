"use client";

import {Inputbox} from '@/components/Inputbox'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

type RegisterFormInputs = {
    email: string,
    password: string,
    password2: string,
    nickname: string,
    subtitle: string
}

export default function Register() {
    const [errstate,setErrstate] = useState<string>('');
    const {register,handleSubmit,formState: { errors },} = useForm<RegisterFormInputs>();
    const {registerContext} = useAuth();
    const router = useRouter();
    const onSubmit:SubmitHandler<RegisterFormInputs> = async(data) => {
            Swal.fire({
                title: "회원가입 하시겠습니까?",
                text: "당신의 노트를 만들어보세요!",
                showCancelButton: true,
                confirmButtonText: "가입하기",
                cancelButtonText: `뒤로가기`
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const res = await registerContext(
                        data.email,
                        data.password,
                        data.password2,
                        data.nickname,
                        data.subtitle,
                    );
                    if(res !== undefined){
                        setErrstate(String(res));
                    }else{
                  router.push('/login');
                  Swal.fire("회원가입이 완료되었습니다!", "당신의 기록으로 채워보세요!", "success");
                } 
              }});
    }

    return (
        <div>
            <Logo />

            <div className='m-20 '>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className=' text-4xl font-black text-center mb-10'>회원가입</p>
                    <Inputbox 
                        register={register("email", { required: '이메일은 필수입니다.',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: '유효한 이메일 주소를 입력하세요.'
                        }})}
                        error={errors.email?.message}
                        type="email" label='이메일'/>
                    <Inputbox 
                        register={register("password", { required: '비밀번호는 필수입니다.' })}
                        type="password" label='비밀번호'/>
                    <Inputbox 
                        register={register("password2", { required: '비밀번호 재입력은 필수입니다.' })}
                        type="password" label='비밀번호 재입력'/>
                    <Inputbox 
                        register={register("nickname", { required: '별명은 필수입니다.' })}
                        type="text" label='별명'/>
                    <Inputbox 
                        register={register("subtitle", { required: '소개는 필수입니다.' })}
                        type="text" label='한단어 소개'/>
                    <p>한단어로 자신을 소개해보세요!</p>
                    <p className='text-red-500 font-bold'>{errstate}</p>
                    <div className='mt-24 grid grid-cols-1 place-items-end'>
                    <button
                        type="submit"
                        className="my-5 w-44 h-16 rounded-xl bg-[#6083FF] font-black text-3xl text-white">
                    가입하기
                    </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
