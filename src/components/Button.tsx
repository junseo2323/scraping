import React from "react"

interface props {
    text: string
}

const Button: React.FC<props> = ({text}) => {
    return(
        <button className="my-5 w-44 h-16 rounded-xl bg-[#6083FF] font-black text-3xl text-white">
            {text}
        </button>
    )
}

export default Button