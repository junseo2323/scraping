'use client';
import dynamic from 'next/dynamic';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Inputbox } from './Inputbox';
import { useRouter } from 'next/navigation';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import Prism from 'prismjs';

import '../app/globals.css';

//toastui-editor-md-preview
interface ArticleEditorProps {
    initialValue?: string;
}

export default function ArticleEditor({ initialValue = ' ' }:ArticleEditorProps) {
    const {user} = useAuth();
    const router = useRouter();

    const editorRef = useRef<Editor>(null);

    const [getContent, setGetContent] = useState("");
    const [title, setTitle] = useState("");


    const titleHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleSave = async() => {
        if(editorRef.current) {
            const content = editorRef.current.getInstance().getMarkdown();
            const body =  {
                title: title,
                content: content,
                writer: user?._id,
                writername: user?.nickname
            }
            try{
                const res = await axios.post('/api/write',body);
                const newUrl = res.data.articleUrl;
                router.push(newUrl);
            }catch(error){
                console.error(error);
            }
        }
    }

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

            <div className='w-[60vw] h-[1000px]'>
                <Editor
                    ref={editorRef}
                    initialValue={initialValue || ' '} 
                    initialEditType="markdown" 
                    previewStyle={window.innerWidth > 900 ? 'vertical' : 'tab'} // tab, vertical
                    hideModeSwitch={true}
                    height="calc(100% - 10rem)"
                    theme={''} // '' & 'dark'
                    usageStatistics={false}
                    toolbarItems={toolbarItems}
                    useCommandShortcut={true}
                    plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]} // 추가!
                />
            </div>
            <button onClick={handleSave} style={{ marginTop: '10px', padding:
                '5px 10px' }}>
                저장
            </button>
          
        </div>
    )
}