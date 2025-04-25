'use client';

import React, { memo } from "react";
import { Popup, type PopupProps } from "~/shared/ui/Popup";
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';

import { useDropzone } from "react-dropzone";
import cn from 'classnames';
import { formatDate } from "../lib/formatDate";

export interface FileInfo {
    name: string,
    size: number,
    uploadedDate: string
}

export interface EditProfileResumeProps extends Omit<PopupProps, 'title'> {
    fileUrl: string | null;
    fileInfo: FileInfo | null,
    handleRemoveFile: () => void,
    onDrop: (files: File[]) => void
}

const parseFileInfo = (fileInfo: FileInfo) => ({
    name: fileInfo.name,
    size: `${(fileInfo.size / 1024).toFixed(2)} КБ `,
    uploadedDate: formatDate(fileInfo.uploadedDate),
})
export const EditProfileResume: React.FC<EditProfileResumeProps> = memo((props) => {
    const { fileInfo, handleRemoveFile, onDrop, setIsOpen } = props;
    const { name, size, uploadedDate } = fileInfo ? parseFileInfo(fileInfo) : {};
    const { getRootProps, getInputProps, isDragActive, } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: false,
    });

    return (
        <Popup title={"Редактирование резюме"} {...props}>
            <div className={'flex flex-col gap-y-8 w-full h-full items-end'}>
                {fileInfo && <div className={'flex flex-col gap-y-2 w-full items-start'}>
                    <div className={'flex flex-row w-full justify-between'}>
                        <div className={'flex flex-row gap-x-1 justify-center'}>
                            <IconFile className={'w-5 h-5 fill-sub'} />
                            <span className={'text-text text-14 font-600'}>{name}</span>
                        </div>
                        <IconTrash onClick={() => { handleRemoveFile(); setIsOpen(false); }} className={'w-5 h-5 fill-red cursor-pointer'} />
                    </div>
                    <div className={'flex flex-row gap-x-4'}>
                        <p className={'text-text text-14'}>{'Размер: '}<span className={'font-600'}>{size}</span></p>
                        <p className={'text-text text-14'}>{'Дата загрузки: '}<span className={'font-600'}>{uploadedDate}</span></p>
                    </div>

                </div>}
                <div
                    {...getRootProps()}
                    className={cn('group flex flex-col items-center justify-center w-full  px-4 h-24 border-2 border-dashed rounded-10 cursor-pointer min-w-popup-dragdrop',
                        isDragActive ? 'border-green-500 bg-green-500' : 'border-mauve bg-base',
                        ' hover:bg-text  hover:border-base transition-colors'
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                        {isDragActive ? (
                            <p className={'text-text text-14'}>{'Отпустите файл здесь...'}</p>
                        ) : (
                            <>
                                <p className={'text-text group-hover:text-base text-14 transition-colors'}>{'Перетащите файл сюда или нажмите, чтобы изменить резюме'}</p>
                                <p className={'text-sub group-hover:text-crust text-12 transition-colors'}>{'Только PDF файлы'}</p>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </Popup>
    );

})