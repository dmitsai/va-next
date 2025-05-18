// NOTE: temp solution for resume uploading and displaying

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import cn from 'classnames';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { EditProfileResume, FileInfo } from '~/features/editProfileResume';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const ProfileFileUploader = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
        setIsEditMode(false);
    };

    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(numPages, prevPageNumber + 1));
    };

    useEffect(() => {
        const resume = localStorage.getItem('resume');
        const resumeInfo = localStorage.getItem('resumeInfo');

        if (resume) {
            setResumeUrl(resume);
        }
        if (resumeInfo) {
            try {
                setFileInfo(JSON.parse(resumeInfo) as FileInfo);
            } catch {
                localStorage.removeItem('resumeInfo');
                setFileInfo(null);
                throw new Error('File not defined after selection');
            }
        }
    }, []);

    const onDrop = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];

            if (file) {
                const newResumeInfo: FileInfo = {
                    name: file.name,
                    size: file.size,
                    uploadedDate: new Date().toDateString(),
                };
                setFileInfo(newResumeInfo);
                localStorage.setItem('resumeInfo', JSON.stringify(newResumeInfo));

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target?.result as string;
                    localStorage.setItem('resume', base64String);
                    setResumeUrl(base64String);
                };
                reader.readAsDataURL(file);
            } else {
                throw new Error('File not defined after selection')
            }
        } else {
            setResumeUrl(null);
            localStorage.removeItem('resume');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: false,
    });

    const handleDeleteResume = () => {
        setResumeUrl(null);
        localStorage.removeItem('resume');
        setNumPages(1);
        setPageNumber(1);
    };

    return (
        <>
            {resumeUrl &&
                <EditProfileResume
                    fileUrl={resumeUrl}
                    fileInfo={fileInfo}
                    handleRemoveFile={handleDeleteResume}
                    onDrop={onDrop}
                    isOpen={isEditMode}
                    setIsOpen={setIsEditMode}
                />
            }
            <div className={cn('relative flex flex-col w-full h-full items-center', resumeUrl ? 'py-4' : 'p-32 justify-center')}>
                {resumeUrl && <IconEdit className={'absolute right-5 top-4 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />}
                
                {!resumeUrl ? (
                    <div
                        {...getRootProps()}
                        className={cn('group flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-10 cursor-pointer',
                            isDragActive ? 'border-green-500 bg-green-500' : 'border-mauve bg-base',
                            ' hover:bg-text hover:border-base transition-colors'
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center">
                            {isDragActive ? (
                                <p className={'text-text text-20'}>{'Отпустите файл здесь...'}</p>
                            ) : (
                                <>
                                    <p className={'text-text group-hover:text-base text-20 transition-colors'}>{'Перетащите резюме сюда или нажмите, чтобы выбрать файл'}</p>
                                    <p className={'text-sub group-hover:text-crust text-16 transition-colors'}>{'Только PDF файлы'}</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row gap-x-4 items-center">
                        <button
                            type={'button'}
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className={'px-4 py-2 h-16 w-16 rounded-full bg-mantle text-text hover:bg-text hover:text-mantle disabled:opacity-50 disabled:cursor-not-allowed'}
                        >
                            {'<'}
                        </button>
                        <div 
                            {...getRootProps()} 
                            className="relative flex flex-col items-center gap-y-2"
                        >
                            {/* Invisible dropzone overlay - covers only PDF area */}
                            <div className="absolute inset-0 z-30 opacity-0 cursor-pointer" />
                            <input {...getInputProps()} />
                            
                            <span className={'text-14 text-text'}>
                                {pageNumber} / {numPages}
                            </span>
                            <Document file={resumeUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page
                                    scale={0.85}
                                    pageNumber={pageNumber}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Document>
                        </div>
                        <button
                            type={'button'}
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            className={'px-4 py-2 h-16 w-16 rounded-full bg-mantle text-text hover:bg-text hover:text-mantle disabled:opacity-50 disabled:cursor-not-allowed'}
                        >
                            {'>'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};