'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const router = useRouter();
    const {user} = useAuth();
    useEffect(()=>{
        if(user){
            router.push('/feed');
        } else{
            router.push('/feed');
        }
    },[user]);
  
    return (
        <div>

        </div>
    )
}
