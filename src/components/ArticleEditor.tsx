'use client';
import dynamic from 'next/dynamic';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Inputbox } from './Inputbox';
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import { fetcher } from "@/utils/api";


import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import Prism from 'prismjs';


import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import '../app/globals.css';
import { MCreateTag } from './CreateTag';
import Swal from 'sweetalert2';

//toastui-editor-md-preview
interface ArticleEditorProps {
    initialValue?: string;
    initialTitle?: string;
    isModify?: boolean;
    setIdModify?: React.Dispatch<React.SetStateAction<boolean>>
    modifyTag?: string[];
    modifyId?: string;
}

export default function ArticleEditor({ initialValue = ' ', initialTitle = ' ', isModify = false, setIdModify, modifyTag = [''], modifyId = '' }:ArticleEditorProps) {
    const {user} = useAuth();
    const router = useRouter();
    const { data } = useSWR(user?'/api/get-tag/' + user?._id:null, fetcher);

    const editorRef = useRef<Editor>(null);

    const [previewStyle, setPreviewStyle] = useState<'vertical' | 'tab'>(
        typeof window !== 'undefined' && window.innerWidth > 900 ? 'vertical' : 'tab'
    );

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 900) {
            setPreviewStyle('vertical');
          } else {
            setPreviewStyle('tab');
          }
        };
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
    
    const [title, setTitle] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>(modifyTag);

    const titleHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    
    const saveFunction = async() => {
        if(editorRef.current) {
            const content = editorRef.current.getInstance().getMarkdown();

            if(isModify){
                const body = {
                    title: title=='' ? initialTitle : title,
                    content: content,
                    images: images,
                    tags: tags
                }
                try{
                    const res = await axios.post('/api/write/'+modifyId,body);
                    const newUrl = res.data.articleUrl;
                    setIdModify?.(false);
                    router.push(newUrl);
                }catch(error){
                    console.error(error);
                }
            }
            else {
                const body =  {
                    title: title,
                    content: content,
                    writer: user?._id,
                    writername: user?.nickname,
                    images: images,
                    tags: tags
                }
                try{
                    const res = await axios.post('/api/write',body);

                }catch(error){
                    console.error(error);
                }
            }
        }
    }

    const handleSave = () => {
        Swal.fire({
            title: '저장하시겠습니까?',
            text: '당신의 새로운 기록을 저장합니다.',
            icon: 'info',

            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            cancelButtonText: '취소', // cancel 버튼 텍스트 지정

        }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                saveFunction();                
            }
        })

    }

    //Markdown 사진 핸들러
    const handleImageUpload = async (blob: Blob): Promise<string> => {
        const formData = new FormData();
        formData.append('file', blob);
      
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      
        const data = await res.json();
        setImages(prevItems => [...prevItems, data.url]);
        return data.url; // 이미지 URL 반환
    };

    const toolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr'],
        ['ul', 'ol', 'task'],
        ['table', 'link'],
        ['image'],
        ['code'],
        ['scrollSync'],
      ];

    return(
        <div>
            <div className="relative pt-4 my-10 ">
            <input
                type='text'
                className="w-[64vw] border-b-2 border-gray-600 bg-transparent text-black text-2xl py-1 focus:border-transparent focus:outline-none focus:ring-0 placeholder-transparent peer"
                placeholder='제목'
                id='제목'
                name='제목'
                defaultValue={initialTitle}
                onChange={titleHandle}
                required
            />
            <label
                htmlFor='제목'
                className="absolute w-[64vw] top-0 left-0 text-gray-300 text-ms text-bold transition-all duration-200  peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-4xl peer-placeholder-shown:font-semibold peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-[#FFAA55] peer-focus:text-sm peer-focus:font-normal"
            >
                제목
            </label>
            </div>

            <MCreateTag 
                tag={tags}
                tagdata={data}
                setTagdata={setTags}
            />

            <div className='md:w-[60vw] h-[1000px]'>
                <Editor
                    ref={editorRef}
                    initialValue={initialValue || ' '} 
                    initialEditType="markdown" 
                    previewStyle={previewStyle}
                    hideModeSwitch={true}
                    height="calc(100% - 10rem)"

                    hooks={{
                        addImageBlobHook: async(blob, callback) => {
                            try{
                                const imageUrl = await handleImageUpload(blob);
                                callback(imageUrl, 'alt text');
                            }catch(error) {
                                console.error("이미지 업로드 실패");
                            }
                        }
                    }}

                    theme={''} // '' & 'dark'
                    usageStatistics={false}
                    toolbarItems={toolbarItems}
                    useCommandShortcut={true}
                    plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]} // 추가!
                />
            </div>
            <button
                onClick={handleSave}
                className="float-right mr-4 my-5 w-28 h-12 md:w-36 text-sm md:text-3xl md:h-16 rounded-xl bg-[#6083FF] font-black  text-white">
                작성하기
            </button>
        </div>
    )
}