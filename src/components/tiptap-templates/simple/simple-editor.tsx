"use client"

import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Custom Scraping! Lib ---
import useSWR from "swr"
import { fetcher } from "@/utils/api";
import { handleSave } from '@/lib/articleUtils';
import { MCreateTag } from "@/components/CreateTag";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { TableKit } from '@tiptap/extension-table'


// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import {all, createLowlight} from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'

const lowlight = createLowlight(all);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('python', python);



// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"
import { useScrolling } from "@/hooks/use-scrolling"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

const TableInsertButton = () => {
  const { editor } = React.useContext(EditorContext)
  if (!editor) return null

  return (
    <Button
      onClick={() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
      }}
    >
      표 삽입
    </Button>
  )
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <TableInsertButton />
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)


//New Editor
export function SimpleEditor() {
  const {user} = useAuth();
  const { data } = useSWR(user?'/api/get-tag/' + user?._id:null, fetcher);
  
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const isMobile = useIsMobile()
  const windowSize = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter();

  const ImageListSet = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: (file, onProgress, abortSignal)=>{
          return handleImageUpload(file, onProgress, abortSignal,ImageListSet)
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      TableKit
    ],
  })

  const isScrolling = useScrolling()
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const savePost = async () => {
    if (!editor) return ;
    const content = editor.getHTML();
    const res = await handleSave(
      user,
      title, 
      content, 
      images, 
      tags
    );
    const data = res;

    if(data) {
      router.push(data);
    }
  }



  
  const titleHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  return (
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

            <MCreateTag 
                tag={tags}
                tagdata={data}
                setTagdata={setTags}
            />

            <div className='md:w-[60vw] h-[1000px]'>
            <div className="simple-editor-wrapper">

              <EditorContext.Provider value={{ editor }}>
                <Toolbar
                  ref={toolbarRef}
                  style={{
                    ...(isScrolling && isMobile
                      ? { opacity: 0, transition: "opacity 0.1s ease-in-out" }
                      : {}),
                    ...(isMobile
                      ? {
                          bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                        }
                      : {}),
                  }}
                >
                  {mobileView === "main" ? (
                    <MainToolbarContent
                      onHighlighterClick={() => setMobileView("highlighter")}
                      onLinkClick={() => setMobileView("link")}
                      isMobile={isMobile}
                    />
                  ) : (
                    <MobileToolbarContent
                      type={mobileView === "highlighter" ? "highlighter" : "link"}
                      onBack={() => setMobileView("main")}
                    />
                  )}
                </Toolbar>

                <EditorContent
                  editor={editor}
                  role="presentation"
                  className="simple-editor-content"
                />
                
                <button
                    onClick={savePost}
                    className="float-right mb-16 mr-4 my-5 w-28 h-12 md:w-36 text-sm md:text-3xl md:h-16 rounded-xl bg-[#6083FF] font-black  text-white">
                    작성하기
                </button>
              </EditorContext.Provider>
              </div>
            </div>
        </div>
    
  )
}
