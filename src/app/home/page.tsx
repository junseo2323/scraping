import {MiniArticle} from "@/components/Article";
import Navigation from "@/components/Navigation";
import data from "@/../data/testdata.json"
import Search from "@/components/Search";
export default function home() {
    const user = data.user

    return(
        <div>
            
            <Navigation />
            <div id="main-top" className="grid grid-cols-2 gap-3">
                <div>
                    <p className="font-black text-2xl pt-10 pl-10">매일의 나를 남기는 일, 기록</p>
                    <p className="font-regular text-sm pt-5 pl-10">{user.name}님의 하루를 기록으로 남겨보세요!</p>
                </div>
                <div className="pt-10">
                    <Search />
                </div>
            </div>
            <div id="main-article">
                <div id="my-article">
                    <MiniArticle />
                </div>
            </div>
        </div>
    )
}