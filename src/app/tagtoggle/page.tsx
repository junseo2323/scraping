"use client"

/**
 * 25.07.22
 * api 셋팅 완료
 * FE 데이터 받아와서 변수처리 완료.
 */

import { useAuth } from "@/context/AuthContext"
import axios from "axios"
import { useEffect, useState } from "react";

type TagresType = {
    _id: string,
    userid: string,
    tagname: string
}

export default function Tagtoggle(){
    const {user} = useAuth();

    const [tag, setTag] = useState<string[]>([]);
    const [home, setHome] = useState<string[]>([]);
    const [profile, setProfile] = useState<string[]>([]);
    
    useEffect(()=>{
        const initData = async() => {
            try{
                if(user?._id){
                    const [tagToggleRes, tagRes] = await Promise.all([
                        axios.get('/api/tagtoggle/' + user._id),
                        axios.get('/api/get-tag/' + user._id)
                    ]);
                    setTag(tagRes.data.map((e: TagresType) => e.tagname));
                    setHome(tagToggleRes.data.home);
                    setProfile(tagToggleRes.data.profile);
                }
            }catch(error){
                console.log(error);
            }
        } 

        initData();
    },[user?._id])

    return(
        <div>
            
        </div>
    )
}