import dummydata from '@/../data/testdata.json'
import Tag from './Tag'
import Link from 'next/link'

const Article = () => {
    const articleData = dummydata.Article
    const tagData = dummydata.Tag
    const tag2Data = dummydata.Tag2

    const backgroundImage = 'img/background/'+articleData._id+'.png'
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'


    return(
        <Link href={articleData.url}>
            <div  className='w-80 place-items-center'>
                <img className='rounded-t-3xl' src={backgroundImage} />
                <div className='grid grid-rows-[1.5fr_1.5fr_0.5fr_1fr] px-3 py-10'>
                    <div className='grid grid-cols-[2fr_0.5fr_0.5fr] pb-7'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-2xl'>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px]'>
                        <Tag text={tagData.tagname} color={tagData.color} />
                        <Tag text={tag2Data.tagname} color={tag2Data.color} />
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}

const MiniArticle = () => {
    const articleData = dummydata.Article
    const tagData = dummydata.Tag
    const tag2Data = dummydata.Tag2

    const backgroundImage = 'img/background/'+articleData._id+'.png'
    const flatformImage = 'img/flatform/'+articleData.flatform+'.png'


    return(
        <Link href={articleData.url}>
            <div  className='w-52 h-32 place-items-center'>
                <img className='rounded-t-2xl' src={backgroundImage} />
                <div className='grid grid-rows-[1fr_1fr_0.5fr_1fr] px-3 py-10'>
                    <div className='grid grid-cols-[1fr_0.5fr_0.5fr] pb-3'>
                        <img className='py-2' src={flatformImage} width={32}/>
                        <div className='bg-[#D9D9D9] rounded-full w-10 h-10'/>
                        <span className='py-2.5 pl-2 text-sm'>{articleData.creator}</span>
                    </div>
                    <p className='font-semibold text-xl'>{articleData.title}</p>
                    <p className='font-light text-sm text-gray-400'>{articleData.subtitle}</p>
                    <div className='py-2 grid grid-cols-[70px_70px]'>
                        <Tag text={tagData.tagname} color={tagData.color} />
                        <Tag text={tag2Data.tagname} color={tag2Data.color} />
                    </div>
                </div>

                <div className='w-36 border-b-2 border-black m-auto' ></div>
            </div>
        </Link>
    )
}


export  {Article,MiniArticle}