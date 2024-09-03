import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";


interface Props {
    type: string,
    label: string,
    register?: UseFormRegisterReturn;
}

const Inputbox: React.FC<Props> = ({type,label,register}) => {
    return(
        <div className="relative pt-4 mt-10 w-1/2">
            
        <input
            type={type}
            className="w-[64vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
            placeholder={label}
            id={label}
            name={label}
            {...register}
            required
        />
        <label
            htmlFor={label}
            className="absolute w-[64vw] top-0 left-0 text-gray-300 text-ms text-bold transition-all duration-200  peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-4xl peer-placeholder-shown:font-semibold peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-[#FFAA55] peer-focus:text-sm peer-focus:font-normal"
        >
            {label}
        </label>
        </div>

    )
}

interface DefultProps {
    type: string,
    defultValue: string
    label: string,
    register?: UseFormRegisterReturn;
}

const DefultInputbox: React.FC<DefultProps> = ({type,label,defultValue,register}) => {
  
    return(
        <div className="relative pt-4 mt-10 w-1/2">
            
        <input
            type={type}
            className="w-[190%] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
            placeholder={label}
            defaultValue={defultValue}
            id={label}
            name={label}
            {...register}
            required
        />
        <label
            htmlFor={label}
            className="absolute w-[64vw] top-0 left-0 text-gray-300 text-ms text-bold transition-all duration-200  peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-4xl peer-placeholder-shown:font-semibold peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-[#FFAA55] peer-focus:text-sm peer-focus:font-normal"
        >
            {label}
        </label>
        </div>

    )
}

export {Inputbox,DefultInputbox}