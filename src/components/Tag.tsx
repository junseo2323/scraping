import React from "react";

interface Props {
    text: string,
    color: number
}

const Tag: React.FC<Props> = ({text,color}) => {
    const generateColorStyle:{[key:number]: string} = {
        0 : 'bg-[#A3D3FF]',
        1 : 'bg-[#FFA3A3]',
        2 : 'bg-[#8B5FBF]',
        3 : 'bg-[#FEC0CE]',
        4 : 'bg-[#2E1F27]',
        5 : 'bg-[#F4C95D]',
        6 : 'bg-[#5D5042]'
    }

    return(
        <div className={generateColorStyle[color]+` w-16 h-8 rounded-2xl text-white font-normal text-sm text-center py-1.5`}>
            {text}
        </div>
    )
}

export default Tag