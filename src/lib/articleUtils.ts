"use client"
import axios from "axios";
import Swal from "sweetalert2";

type SaveFunctionType = (body: any) => Promise<string>;

/*
const body =  {
        title: title,
        content: content,
        writer: user?._id,
        writername: user?.nickname,
        images: images,
        tags: tags
}
*/
const saveFunction:SaveFunctionType = async(body) => {
    try{
        const res = await axios.post('/api/write',body);
        const newUrl = res.data.articleUrl;
        return newUrl;
    }catch(error){
        console.error(error);
    }   
}

/**
 const body = {
            title: title=='' ? initialTitle : title,
            content: content,
            images: images,
            tags: tags
}
 */
type ModifyFunctionType = (modifyId: string, body: any) => Promise<string>;

const modifyFunction:ModifyFunctionType = async(modifyId, body) => {
        try{
            //title,content,images,tags
            const res = await axios.post('/api/write/'+modifyId,body);
            const newUrl = process.env.NEXT_PUBLIC_SCRAPING_URL+"/article/"+res.data._id;
            return newUrl;
        }catch(error){
            console.error(error);
            return "";
        }
}

type handleModifyProps = (
  modifyId : string,
  title : string,
  content : string,
  images : string[],
  tags: string[]
) => Promise<string>;

export const handleModify: handleModifyProps = async (
  modifyId,title, content, images, tags
) => {
  const body = {
    title,
    content,
    images,
    tags
  };

  const result = await Swal.fire({
    title: '수정하시겠습니까?',
    text: '당신의 기록을 수정합니다.',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
  });

  if (result.isConfirmed) {
    const url = await modifyFunction(modifyId,body);  // ✅ 비동기 호출 예상
    return url;
  } else {
    return '';
  }
};

type handleSaveProps = (
    user : any,
    title : string,
    content : string,
    images : string[],
    tags: string[]
) => Promise<string>;

export const handleSave: handleSaveProps = async (
    user, title, content, images, tags
  ) => {
    const body = {
      title,
      content,
      writer: user?._id,
      writername: user?.nickname,
      images,
      tags
    };
  
    const result = await Swal.fire({
      title: '저장하시겠습니까?',
      text: '당신의 새로운 기록을 저장합니다.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '승인',
      cancelButtonText: '취소',
    });
  
    if (result.isConfirmed) {
      const url = await saveFunction(body);  // ✅ 비동기 호출 예상
      return url;
    } else {
      return '';
    }
  };
  