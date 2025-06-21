"use client";

import Button from '@/components/Button';
import { Inputbox } from '@/components/Inputbox';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function Login() {
    const { register, handleSubmit } = useForm<LoginFormInputs>(); 
    const { login } = useAuth();

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        login(data.email, data.password);
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
                        register={register("password", { required: '이메일은 필수입니다.' })}
                        type="password"
                        label="비밀번호"
                    />
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
