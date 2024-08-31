import Link from "next/link"

const Logo = () => {
    return(
        <Link href='/' className="grid grid-cols-2 w-48 place-item-left my-10" >
            <img className="ml-8" src='img/scraping_icon.png' width={36}/>
            <p className="font-black text-2xl">Scraping</p>
        </Link>
    )
}

export default Logo