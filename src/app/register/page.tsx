"use client";

import {Inputbox} from '@/components/Inputbox'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';

type RegisterFormInputs = {
    email: string,
    password: string,
    password2: string,
    nickname: string,
    subtitle: string
}

export default function Register() {
    const {register,handleSubmit} = useForm<RegisterFormInputs>();
    const {registerContext} = useAuth();
    const router = useRouter();
    const onSubmit:SubmitHandler<RegisterFormInputs> = (data) => {
        registerContext(
            data.email,
            data.password,
            data.password2,
            data.nickname,
            data.subtitle,
        );
        router.push('/login');
    }

    return (
        <div>
            <Logo />

            <div className='m-20 '>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className=' text-4xl font-black text-center mb-10'>회원가입</p>
                    <Inputbox 
                        register={register("email", { required: '이메일은 필수입니다.' })}
                        type="email" label='이메일'/>
                    <Inputbox 
                        register={register("password", { required: '이메일은 필수입니다.' })}
                        type="password" label='비밀번호'/>
                    <Inputbox 
                        register={register("password2", { required: '이메일은 필수입니다.' })}
                        type="password" label='비밀번호 재입력'/>
                    <Inputbox 
                        register={register("nickname", { required: '이메일은 필수입니다.' })}
                        type="text" label='별명'/>
                    <Inputbox 
                        register={register("subtitle", { required: '이메일은 필수입니다.' })}
                        type="text" label='한단어 소개'/>
                    <p>한단어로 자신을 소개해보세요!</p>

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
