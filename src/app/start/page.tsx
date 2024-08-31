import Link from "next/link";

export default function Start() {
    return (
        <div className="my-[15vh]">
            <div className="grid grid-cols-1 gap-7 place-items-center">
                <img src='img/scraping_icon.png' width={144}/>
                
                <p className="font-black text-6xl">Scraping</p>
                <p className="font-normal text-2xl">매일의 나를 남기는 일, 기록</p>

                <div className="grid grid-cols-1 gap-4 place-items-center mt-14">
                    <button className="bg-black text-white w-64 h-14 rounded-2xl font-bold text-ms">카카오톡으로 <br/> 회원가입/로그인</button>
                    <Link href='/register' className="text-center py-3.5 bg-black text-white w-64 h-14 rounded-2xl font-bold text-xl">회원가입</Link>
                    <Link href='/login' className="font-light text-s">로그인</Link>
                </div>
            </div>
        </div>
    )
}
