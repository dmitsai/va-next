'use client';

import React, { useState } from 'react';
import { OptionalString } from '~/shared/lib/types';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export interface ResumeTabProps {
    pdfUrl: OptionalString;
}
export const ResumeTab: React.FC<ResumeTabProps> = ({ pdfUrl }) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prevPageNumber) =>
            Math.min(numPages, prevPageNumber + 1)
        );
    };

    const onDocumentLoadSuccess = ({
        numPages,
    }: {
        numPages: number;
    }): void => {
        setNumPages(numPages);
    };
    return (
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
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
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
    );
};
