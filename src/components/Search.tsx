const Search = () => {
    return(
        <div className="bg-gray-200 w-[18rem] h-11 rounded-xl ">
            <input
                className="float-left pl-2 w-[16rem] h-11  bg-gray-200 rounded-xl focus:outline-none placeholder:pl-3 placeholder:text-sm placeholder:font-thin placeholder:text-gray-600"
                placeholder="기록 검색하기"
                type="text"
            />            
            <img className="pt-2" src="img/icons/search.png" width={24}/>
        </div>
    )
}

export default Search