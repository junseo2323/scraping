import React from "react";

interface Props {
    text: string,
    color: string
}

const Tag: React.FC<Props> = ({text,color}) => {
    const myStyle: React.CSSProperties = {
        backgroundColor: color, // Note that backgroundColor uses camelCase
      };
    return(
        <div style={myStyle} className={` w-16 h-8 rounded-2xl text-white font-normal text-sm text-center py-1.5`}>
            {text}
        </div>
    )
}

export default Tag