
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style

interface Props {
    content: string;
    editorRef: React.MutableRefObject<any>;
}
export default function ArticleViewer({ content = '', editorRef }: Props){
   return(
        <Viewer
            key={content}
            ref={editorRef}
            initialValue={content}
        />
    )
}