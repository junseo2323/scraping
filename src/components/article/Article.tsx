import Tag from '../Tag'
import Link from 'next/link'
import React from 'react'
import { createArticleData, tagData } from "@/types/type"

interface Articleprops {
    articleData: createArticleData,
    tagData: tagData
}

const Article: React.FC<Articleprops> = ({ articleData, tagData }) => {
    const backgroundTmp = Array.isArray(articleData.image) 
    ? articleData.image[0]?.url || '/img/article/default.jpg' 
    : articleData.image || '/img/article/default.jpg';
    const backgroundImage = String(backgroundTmp)
    const flatformImage = `/img/flatform/${articleData.flatform}.png`

    const tagGenerator = () => {
        let resultTag = []
        for (let tmptag of tagData) {
            if (articleData.tag && articleData.tag.includes(tmptag.tagname)) {
                resultTag.push(tmptag)
            }
        }
        return resultTag
    }

    const tagList = tagGenerator()


    return (
        <Link href={articleData.url}>
            <div className='w-80 ml-auto place-items-center'>
                <div className='w-[100%] h-64  overflow-hidden'>
                    <img referrerPolicy="no-referrer" className='rounded-t-3xl' src={backgroundImage} />
                </div>
                <div className='grid grid-rows-[1.5fr_1.5fr_0.5fr_1fr] px-3 py-[20px]'>
                    <div className='grid grid-cols-[2fr_0.5fr_0.5fr] pb-7'>
                        <img className='py-2' src={flatformImage} width={32} />
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10' />
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-2xl '>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400 w-[100%] h-14 overflow-clip'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px_70px_70px] gap-y-2'>
                        {
                            tagList.map((i) => (
                                <Tag key={i.tagname} text={i.tagname} color={i.color} />
                            ))
                        }
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}

export default Article;