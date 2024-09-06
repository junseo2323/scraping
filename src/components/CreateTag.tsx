import React, { useState } from "react"
import Tag from "./Tag"
import axios from "axios"
import useSWR from "swr"
import { ObjectId } from "mongodb"

type createArticleData = {
    _id : ObjectId
    url : string,
    image: [{
        url:string
    }],
    creator: string,
    title : string|undefined,
    subtitle: string|undefined,
    flatform: string,
    tag : string[]
}

interface CreateTagProps {
    articletag : [string],
    tagdata : [tag],
    setInitalData : React.Dispatch<React.SetStateAction<createArticleData>>
}

type tag = {
    tagname: string,
    color : string
}


const CreateTag:React.FC<CreateTagProps> = ({articletag,tagdata,setInitalData}) => {
    let tagList:tag[];
    const tagGenerator = () => {
        let resultTag = []
        if(tagdata){
            for (let tmptag of tagdata) {
                if(articletag && articletag.includes(tmptag.tagname)){
                    resultTag.push(tmptag)
                }
            } 
        }
        return resultTag
    }

    tagList = tagGenerator()

    return(
        <div className="py-10">
            <p className="">태그</p>
            <div className='py-2 grid grid-cols-[70px_70px_70px_70px] gap-y-2'>
                {
                    tagList.map((i)=>(
                        <Tag text={i.tagname} color={i.color} />
                    ))
                }
            </div>
            <AddTag articletag={articletag} setInitalData={setInitalData}/>
        </div>
    )
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface AddTagProps {
    articletag : [string],
    setInitalData : React.Dispatch<React.SetStateAction<createArticleData>>

}
const AddTag:React.FC<AddTagProps> = ({articletag,setInitalData}) => {
    const {data,error,isLoading,mutate} = useSWR('api/get-tag',fetcher)
    const [tagText, setTagText] = useState<string>()
    
    const enterText = () => {
        const createColors = () => {
            
            let randomHex = Math.floor(Math.random() * 0xffffff).toString(16);
            randomHex = `#${randomHex.padStart(6,'0')}`;
    
            return randomHex;
        }
        const addData = {
            tagname: tagText,
            color: createColors()
        }
        axios.post('api/post-tag',addData)
            .then((res) => {
                mutate('api/get-tag')
            })
            .catch((error) =>{console.error(error)})
        if(tagText) selectTag({tagname:tagText,color:''})
        setTagText('')
    }
    const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            enterText()
        }
    }
    const deleteActive = (tagname:string) => {
        selectTag({tagname:tagname,color:''})
        axios.delete('api/delete-tag?tagname='+tagname)
            .then((res) => {mutate('api/get-tag')})
            .catch((error) => {console.error(error)})
    }

    const selectTag = (i:tag) => {

        if(articletag.includes(i.tagname)){
            const itemToFind = articletag.filter((e)=> e !== i.tagname)
            setInitalData((prevState) => ({
                ...prevState,
                tag: itemToFind
            }))

        } else {
            const itemToFind:string[] = [...articletag, i.tagname]
            setInitalData((prevState) => ({
                ...prevState,
                tag: itemToFind
            }))
        }
    }

    return(
        <div className="w-94 mr-5 lg:w-[500px] h-64 rounded-xl drop-shadow-2xl bg-white overflow-auto scrollbar-hide" >
            <input 
                type="text" 
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setTagText(e.target.value)}}
                value={tagText}
                onKeyDown={activeEnter}
                className="sticky top-0 pl-5 bg-gray-200 w-[100%] rounded-t-xl h-12" />
            <p className="text-gray-400 text-sm p-5">태그 선택 또는 생성</p>
            <div className="px-5">
            {
                data&&data!=='api/get-tag'&&(
                    data.map((i: tag)=>(
                        <div className="py-1">
                            <button className="float-right"
                                onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{if(e.detail === 1){deleteActive(i.tagname)}}}
                            >삭제</button>
                            <div onClick={()=>{
                                selectTag(i)
                            }}>
                                <Tag text={i.tagname} color={i.color} />
                            </div>
                        </div>
                    ))
                )
            }
            </div>
        </div>
    )
}

export default CreateTag