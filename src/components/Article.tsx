import dummydata from '@/../data/testdata.json'
import Tag from './Tag'
import Link from 'next/link'
import React from 'react'

interface props {
    articleData : articleData,
    tagData : tagData
}

type articleData = {
    url : string,
    creator: string,
    title : string,
    subtitle: string,
    _id : string,
    flatform: string,
    tag : [string]
}

type createArticleData = {
    url : string,
    image: [{
        url:string
    }],
    creator: string,
    title : string | undefined,
    subtitle: string | undefined,
    flatform: string,
    tag : [string]
}

interface Articleprops {
    articleData : createArticleData,
    tagData : tagData
}

type tagData = [{
    color: number,
    tagname : string
}]

const Article:React.FC<Articleprops> = ({articleData,tagData}) => {
    const backgroundImage = articleData.image[0].url
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'
    
    const tagGenerator = () => {
        let resultTag = []
        for (let tmptag of tagData) {
            if(articleData.tag && articleData.tag.includes(tmptag.tagname)){
                resultTag.push(tmptag)
            }
        } 
        return resultTag
    }

    const tagList = tagGenerator()
    

    return(
        <Link href={articleData.url}>
            <div  className='w-80 ml-auto place-items-center'>
                <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                <div className='grid grid-rows-[1.5fr_1.5fr_0.5fr_1fr] px-3 py-10'>
                    <div className='grid grid-cols-[2fr_0.5fr_0.5fr] pb-7'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-2xl'>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px]'>
                        {/*
                            tagList.map((i)=>(
                                <Tag text={i.tagname} color={i.color} />
                            ))
                        */}
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}

const MiniArticle:React.FC<props> = ({articleData,tagData}) => {
    const backgroundImage = 'img/background/'+articleData._id+'.png'
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'
    const tagGenerator = () => {
        let resultTag = []
        for (let tmptag of tagData) {
            if(articleData.tag.includes(tmptag.tagname)){
                resultTag.push(tmptag)
            }
        } 
        return resultTag
    }

    const tagList = tagGenerator()

    return(
        <Link href={articleData.url}>
            <div  className='w-60 h-32 place-items-center'>
                <img className='rounded-t-xl' src={backgroundImage} />
                <div className='grid grid-rows-[0.5fr_1fr_0.5fr_0.5fr] px-3 py-8'>
                    <div className='grid grid-cols-[1fr_0.5fr_0.5fr] pb-3'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-xl'>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px]'>
                    {
                            tagList.map((i)=>(
                                <Tag text={i.tagname} color={i.color} />
                            ))
                        }                    
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}


export  {Article,MiniArticle}