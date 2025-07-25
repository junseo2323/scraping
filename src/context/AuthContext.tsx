"use client"

import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  login: (email: string, password: string) => void;
  logout: () => void;
  registerContext: (email:string, password:string, password2:string, nickname: string, subtitle:string) => void;
  configToken: () => void;
  user?: User;
  isLoading: boolean;
}

interface User {
  _id: string;
  email: string;
  nickname: string;
  subtitle: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }:{children: ReactNode}) => {
  const [user, setUser] = useState<User|undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    configToken();
  },[]);

  const configToken = async() => {
    setIsLoading(true);
    try {
      const user = await api.get<User>("/api/me"); 
      setUser(user);
    } catch (error) {
      setUser(undefined);
    } finally {
      setIsLoading(false);
    }
  }

  
  //로그인
  const login = async(email: string, password: string) => {
    try {
      const data = await api.post<{ token: string }>("/api/login", { email, password });
      localStorage.setItem("token", data.token);

      const user = await api.get<User>("/api/me"); 
      setUser(user);
      router.push("/home");
    } catch (error) {
      return error;
    }
  };

  //회원가입
  const registerContext = async(email:string, password:string, password2:string, nickname: string, subtitle:string) => {
    try{
      const data = await api.post<{token: string}>("/api/register",{
        email,
        password,
        password2,
        nickname,
        subtitle
      });
      localStorage.setItem("token",data.token);
    }catch(error){
      return error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{login,logout ,registerContext, configToken, user, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 

// useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 반드시 <AuthProvider> 내부에서 사용해야 합니다.');
  }
  return context;
};


