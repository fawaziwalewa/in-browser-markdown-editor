'use client';
import { useState, useEffect, useRef } from "react";
import Markdown from 'react-markdown';

const Main = ({ content, onUpdate }) => {
    const [markdown, setMarkdown] = useState(content);
    const [showEditor, setShowEditor] = useState(true);

    const handleInputChange = (e) => {
        setMarkdown(e.target.innerText);
    }

    const updateContentInParent = (e) => {
        onUpdate(e.target.innerText);
    }

    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            // Insert as plain text, NOT HTML
            editorRef.current.innerText = content;
            // Handle input change to update state
            handleInputChange({ target: editorRef.current });
        }
    }, [content]);

    return (
        <main className={`grid divide-x divide-neutral-300 dark:divide-neutral-600 h-full overflow-y-auto ${showEditor && 'md:grid-cols-2'}`}>
            {/* Markdown text */}
            <div className={`flex flex-col ${showEditor ? 'block' : 'hidden'}`}>
                <h1 className="p-4 font-medium md:px-6 text-neutral-500 bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400">MARKDOWN</h1>
                <div
                    contentEditable="true"
                    ref={editorRef}
                    className="flex-grow p-4 md:px-6 focus:outline-none dark:text-neutral-400 text-neutral-700"
                    onBlur={updateContentInParent}
                    onInput={handleInputChange}>
                </div>
            </div>
            {/* Markdown preview */}
            <div className="flex flex-col w-full">
                <h1 className="flex items-center justify-between p-4 font-medium md:px-6 text-neutral-500 bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400">
                    <span>PREVIEW</span>
                    <button type="button" className="cursor-pointer hover:text-orange-dark" onClick={() => setShowEditor(!showEditor)}>
                        <span className="sr-only">Toggle editor</span>
                        {showEditor ? (
                            // Show editor icon
                            <svg width="16" height="12" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.784.003c4.782-.144 7.597 4.31 8.109 5.198a.8.8 0 0 1 0 .8c-.688 1.2-3.255 5.086-7.677 5.198h-.2c-4.71 0-7.405-4.326-7.909-5.198a.8.8 0 0 1 0-.8C.803 4.001 3.362.115 7.784.003Zm.38 1.6h-.3c-3.199.08-5.286 2.71-6.086 3.998C2.482 6.73 4.73 9.68 8.176 9.6c3.199-.08 5.262-2.711 6.086-3.999-.712-1.127-2.967-4.086-6.398-3.998ZM8 2.803A2.799 2.799 0 1 1 8 8.4a2.799 2.799 0 0 1 0-5.598Zm0 1.599A1.2 1.2 0 1 0 8 6.8a1.2 1.2 0 0 0 0-2.4Z" fill="currentColor" />
                            </svg>
                        ) : (
                            // Hide editor icon
                            <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.38.027a.795.795 0 0 1 .769.206L14.815 12.9a.792.792 0 0 1 0 1.124.792.792 0 0 1-1.124 0L9.234 9.567a2.77 2.77 0 0 1-3.753-3.753L1.024 1.357a.795.795 0 0 1 .357-1.33Zm.998 3.832 1.156 1.116a10.846 10.846 0 0 0-1.773 2.153c.696 1.117 2.929 4.038 6.333 3.959a6.127 6.127 0 0 0 1.346-.198l1.25 1.25a7.505 7.505 0 0 1-2.556.53h-.198c-4.663 0-7.331-4.282-7.83-5.145a.792.792 0 0 1 0-.792A12.58 12.58 0 0 1 2.378 3.86Zm5.328-2.272c4.726-.143 7.52 4.267 8.028 5.145.15.24.163.542.031.792a12.58 12.58 0 0 1-2.304 2.874l-1.195-1.116a10.846 10.846 0 0 0 1.813-2.154c-.705-1.116-2.937-4.045-6.333-3.958a6.127 6.127 0 0 0-1.346.198L5.149 2.117a7.505 7.505 0 0 1 2.557-.53Zm-.974 5.486v.055c0 .656.532 1.188 1.188 1.188l.047-.008-1.235-1.235Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </h1>
                <div className={`flex-grow md:px-6 p-4 ${!showEditor ? 'lg:w-1/2 mx-auto' : ''}`}>
                    <div className="w-full prose max-w-none">
                        <Markdown>{markdown}</Markdown>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Main;
