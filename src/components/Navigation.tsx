"use client"

import Link from "next/link"
import Logo from "./Logo"
import dummydata from "@/../data/testdata.json"
import { usePathname } from "next/navigation"

const Navigation = () => {
    const path = usePathname()
    
    const user = dummydata.user
    
    return(
        <div className="relative float-left top-0 grid grid-rows-[0.5fr_1fr_3fr] w-60">
            <Logo />
            <div className="grid grid-cols-[0.5fr_1.5fr] place-items-center pl-8">
                <div className="rounded-xl bg-gray-300 w-12 h-12" />
                <div>    
                    <p className="font-light text-sm">{user.subtitle}</p>
                    <p className="font-normal text-2xl">{user.name}</p>
                </div>
            </div>
            <div className="grid grid-rows-5 pl-8">
                <p className="font-medium text-lg text-gray-600">나의 기록들</p>
                <Link href='/home' className="grid grid-cols-[0.5fr_1.5fr]">
                    <img src="img/icons/home.png" width={32}/>
                    <p className={`text-xl py-0.5` + (path==='/home' && " text-[#FFAA55] font-bold ")}>스크래핑 홈</p>
                </Link>
                <Link href='/create' className="grid grid-cols-[0.5fr_1.5fr]">
                    <img src="img/icons/create.png" width={32}/>
                    <p className={`text-xl py-0.5` + (path==='/create' && " text-[#FFAA55] font-bold ")}>기록하기</p>
                </Link>
                <Link href='/category' className="grid grid-cols-[0.5fr_1.5fr]">
                    <img src="img/icons/category.png" width={32}/>
                    <p className={`text-xl py-0.5` + (path==='/category' && " text-[#FFAA55] font-bold ")}>주제별 보기</p>
                </Link>
                <Link href='/feed' className="grid grid-cols-[0.5fr_1.5fr]">
                    <img src="img/icons/feed.png" width={32}/>
                    <p className={`text-xl py-0.5` + (path==='/feed' && " text-[#FFAA55] font-bold ")}>피드</p>
                </Link>
            </div>
        </div>
    )
}

export default Navigation