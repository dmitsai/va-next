'use client';

import React, { useState } from 'react';
import { UploadDropzone } from '~/utils/uploadthing';
import { clientApi } from 'trpc/client';
import { Document, Page, pdfjs } from 'react-pdf';
import cn from 'classnames';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { ReactComponent as LoadingIcon } from '~/shared/assets/icons/spin.svg';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { EditProfileResume } from '~/features/editProfileResume';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const ProfileFileUploader = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const uploadedDate = new Date();
    const {
        data: resumeUrl,
        isLoading,
        isSuccess,
        refetch,
    } = clientApi.files.getPdf.useQuery();

    const handleRefetch = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        refetch();
    };

    const onDocumentLoadSuccess = ({
        numPages,
    }: {
        numPages: number;
    }): void => {
        setNumPages(numPages);
        setIsEditMode(false);
    };

    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prevPageNumber) =>
            Math.min(numPages, prevPageNumber + 1)
        );
    };

    return (
        <div
            className={cn(
                'relative flex h-full w-full flex-col items-center',
                resumeUrl ? 'py-4' : 'justify-center p-32'
            )}
        >
            {isSuccess && resumeUrl && (
                <>
                    <EditProfileResume
                        handleRefetch={handleRefetch}
                        fileUrl={resumeUrl}
                        fileInfo={{
                            name: 'Ваше резюме',
                            size: 41000,
                            uploadedDate: uploadedDate.toDateString(),
                        }}
                        isOpen={isEditMode}
                        setIsOpen={setIsEditMode}
                    />
                    <IconEdit
                        className={
                            'absolute right-5 top-4 h-5 w-5 cursor-pointer fill-sub hover:fill-surface'
                        }
                        onClick={() => setIsEditMode(true)}
                    />
                    <div className="flex flex-row items-center gap-x-4">
                        <button
                            type={'button'}
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className={
                                'h-16 w-16 rounded-full bg-mantle px-4 py-2 text-text hover:bg-text hover:text-mantle disabled:cursor-not-allowed disabled:opacity-50'
                            }
                        >
                            {'<'}
                        </button>
                        <div className={'flex flex-col items-center gap-y-2'}>
                            <span className={'text-14 text-text'}>
                                {pageNumber} / {numPages}
                            </span>
                            <Document
                                file={resumeUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
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
                            className={
                                'h-16 w-16 rounded-full bg-mantle px-4 py-2 text-text hover:bg-text hover:text-mantle disabled:cursor-not-allowed disabled:opacity-50'
                            }
                        >
                            {'>'}
                        </button>
                    </div>
                </>
            )}

            {isSuccess && !resumeUrl && (
                <div
                    className={cn(
                        'group relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-10 border-2 border-dashed',
                        'border-mauve bg-base transition-colors hover:border-base hover:bg-text'
                    )}
                >
                    <UploadDropzone
                        config={{ mode: 'auto' }}
                        endpoint="pdfUploader"
                        className="left-30 top-15 absolute z-30 h-full w-96 cursor-pointer opacity-0"
                        appearance={{
                            container: 'h-full w-full !m-0',
                            uploadIcon: 'hidden',
                            label: 'hidden',
                            button: 'hidden',
                        }}
                        content={{
                            label: '',
                            uploadIcon: '',
                            allowedContent: '',
                        }}
                        onUploadProgress={() => {
                            setIsUploading(true);
                        }}
                        onClientUploadComplete={async () => {
                            setIsUploading(false);
                            await refetch();
                        }}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                    <div className="flex flex-col items-center justify-center">
                        <p
                            className={
                                'text-20 text-text transition-colors group-hover:text-base'
                            }
                        >
                            {
                                'Перетащите резюме сюда или нажмите, чтобы выбрать файл'
                            }
                        </p>
                        <p
                            className={
                                'text-16 text-sub transition-colors group-hover:text-crust'
                            }
                        >
                            {'Только PDF файлы'}
                        </p>
                    </div>
                </div>
            )}

            {(isUploading || isLoading) && (
                <div className="absolute inset-0 z-40 flex h-full w-full items-center justify-center rounded-10 bg-mantle">
                    <LoadingIcon className={'animate-spin'} />
                </div>
            )}
        </div>
    );
};
