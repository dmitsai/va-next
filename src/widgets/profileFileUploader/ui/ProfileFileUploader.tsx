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

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const ProfileFileUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    data: resumeUrl,
    isLoading,
    isSuccess,
    refetch,
  } = clientApi.files.getPdf.useQuery();

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

  return (
    <div className={cn('relative flex flex-col w-full h-full items-center', resumeUrl ? 'py-4' : 'p-32 justify-center')}>
      {isSuccess && resumeUrl && (
        <>
          <IconEdit 
            className={'absolute right-5 top-4 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} 
            onClick={() => setIsEditMode(true)} 
          />
          <div className="flex flex-row gap-x-4 items-center">
            <button
              type={'button'}
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className={'px-4 py-2 h-16 w-16 rounded-full bg-mantle text-text hover:bg-text hover:text-mantle disabled:opacity-50 disabled:cursor-not-allowed'}
            >
              {'<'}
            </button>
            <div className={'flex flex-col items-center gap-y-2'}>
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
        </>
      )}

      {isSuccess && !resumeUrl && (
        <div
          className={cn(
            'group flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-10 cursor-pointer',
            'border-mauve bg-base hover:bg-text hover:border-base transition-colors'
          )}
        >
          <div className="flex flex-col items-center justify-center">
            <p className={'text-text group-hover:text-base text-20 transition-colors'}>
              {'Перетащите резюме сюда или нажмите, чтобы выбрать файл'}
            </p>
            <p className={'text-sub group-hover:text-crust text-16 transition-colors'}>
              {'Только PDF файлы'}
            </p>
          </div>
        </div>
      )}

      <UploadDropzone
        config={{ mode: 'auto' }}
        endpoint="pdfUploader"
        className="absolute left-30 top-15 z-30 h-full w-96 cursor-pointer opacity-0"
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

      {(isUploading || isLoading) && (
        <div className="absolute inset-0 z-40 flex h-full w-full items-center justify-center rounded-10 bg-mantle">
          <LoadingIcon className={'animate-spin'} />
        </div>
      )}
    </div>
  );
};