"use client"

import Link from "next/link"
import Logo from "./Logo"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {user,logout} = useAuth();
    const path = usePathname() ?? '';

    const hideOn = ["/login", "/register","/start"];

    if (hideOn.includes(path)) return null;

    return(
            user ?
            <div>
            <div className="grid grid-cols-2">
                <Logo />
                <div className="flex justify-end pr-4">
                    <button
                    className="md:hidden p-4 pl-20"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <img src="/img/icons/hamburger.png" alt="Menu" width={24} />
                    </button>
                </div>
            </div>

            <div
                className={`absolute z-10 md:z-0 top-0 left-0 bg-white h-full shadow-md w-70 transition-transform duration-300 
                    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:relative md:translate-x-0 md:block `}
            >
                <div className="md:hidden">
                    <Logo />
                </div>
                <div className="relative float-left top-0 grid grid-rows-[1fr_7fr] w-60 gap-5">
                    <div className="pl-8">  
                        <p className="font-normal text-2xl">{user?.nickname}</p>  
                        <p className="font-light text-sm">{user?.subtitle}</p>
                    </div>
                    <div className="grid grid-rows-5 pl-8 gap-2">
                        <Link href='/home' className="grid grid-cols-[0.5fr_1.5fr]">
                            <img src="/img/icons/home.png" width={32}/>
                            <p className={`text-xl py-0.5` + (path==='/home' && " text-[#FFAA55] font-bold ")}>스크래핑 홈</p>
                        </Link>
                        <Link href='/create' className="grid grid-cols-[0.5fr_1.5fr]">
                            <img src="/img/icons/create.png" width={32}/>
                            <p className={`text-xl py-0.5` + (path==='/create' && " text-[#FFAA55] font-bold ")}>기록하기</p>
                        </Link>
                        <Link href='/feed' className="grid grid-cols-[0.5fr_1.5fr]">
                            <img src="/img/icons/category.png" width={32}/>
                            <p className={`text-xl py-0.5` + (path==='/feed' && " text-[#FFAA55] font-bold ")}>피드</p>
                        </Link>
                        <Link href={'/profile/'+user?._id} className="grid grid-cols-[0.5fr_1.5fr]">
                            <img src="/img/icons/category.png" width={32}/>
                            <p className={`text-xl py-0.5` + (path==='/profile/'+user?._id && " text-[#FFAA55] font-bold ")}>프로필</p>
                        </Link>
                        <div className="grid grid-cols-[0.5fr_1.5fr]" onClick={logout}>
                            <img src="/img/icons/feed.png" width={32}/>
                            <p className={`text-xl py-0.5`}>로그아웃</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>:
        <div>
        <div className="grid grid-cols-2">
            <Logo />
            <div className="flex justify-end pr-4">
                <button
                className="md:hidden p-4 pl-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <img src="/img/icons/hamburger.png" alt="Menu" width={24} />
                </button>
            </div>
        </div>

        <div
            className={`absolute z-10 md:z-0 top-0 left-0 bg-white h-full shadow-md w-70 transition-transform duration-300 
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:relative md:translate-x-0 md:block `}
        >
            <div className="md:hidden">
                <Logo />
            </div>
            <div className="relative float-left top-0 grid grid-rows-[1fr_7fr] w-60 gap-5">
                <div className="pl-8">  
                    <p className="font-normal text-2xl">로그인 해주세요!</p>  
                </div>
                <div className="grid grid-rows-5 pl-8 gap-2">
                    <Link href='/feed' className="grid grid-cols-[0.5fr_1.5fr]">
                        <img src="/img/icons/category.png" width={32}/>
                        <p className={`text-xl py-0.5` + (path==='/feed' && " text-[#FFAA55] font-bold ")}>피드</p>
                    </Link>
                    <Link className="grid grid-cols-[0.5fr_1.5fr]" href='/login'>
                        <img src="/img/icons/feed.png" width={32}/>
                        <p className={`text-xl py-0.5`}>로그인</p>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Navigation