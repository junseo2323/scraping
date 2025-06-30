"use client";

import Button from '@/components/Button';
import { Inputbox } from '@/components/Inputbox';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function Login() {
    const { register, handleSubmit } = useForm<LoginFormInputs>(); 
    const { login } = useAuth();

    const [errstate,setErrstate] = useState<string>('');

    const onSubmit: SubmitHandler<LoginFormInputs> = async(data) => {
        const res = await login(data.email, data.password);

        if(res !== undefined){
            setErrstate(String(res));
        } else {
            setErrstate("");
        }
    };

    return (
        <div>
            <Logo />
            <div className='m-20'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className='text-4xl font-black text-center mb-10'>로그인</p>
                    <Inputbox
                        register={register("email", { required: '이메일은 필수입니다.' })}
                        type="email"
                        label="이메일"
                    />
                    <Inputbox
                        register={register("password", { required: '비밀번호는 필수입니다.' })}
                        type="password"
                        label="비밀번호"
                    />
                    <Link href="/register"><p>아이디가 없다면? 회원가입</p></Link>
                    <p className='text-red-500 font-bold'>{errstate}</p>
                    <div className='mt-24 grid grid-cols-1 place-items-end'>
                        <button
                            type="submit"
                            className="my-5 w-44 h-16 rounded-xl bg-[#6083FF] font-black text-3xl text-white">
                        로그인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
