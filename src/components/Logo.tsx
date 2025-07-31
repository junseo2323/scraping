import Link from "next/link"

const Logo = () => {
    return(
        <Link href='/home' className="grid grid-cols-[1fr_1.5fr] w-52 place-item-left my-10" >
            <img className="ml-8" src='/img/scraping_icon.png' width={36}/>
            <p className="font-black text-2xl">Scraping</p>
        </Link>
    )
}

export default Logo