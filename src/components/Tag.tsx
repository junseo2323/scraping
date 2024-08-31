import React from "react";

interface Props {
    text: string,
    color: number
}

const Tag: React.FC<Props> = ({text,color}) => {
    const generateColorStyle:{[key:number]: string} = {
        0 : 'bg-[#A3D3FF]',
        1 : 'bg-[#FFA3A3]'
    }

    return(
        <div className={generateColorStyle[color]+` w-16 h-8 rounded-2xl text-white font-normal text-sm text-center py-1.5`}>
            {text}
        </div>
    )
}

export default Tag