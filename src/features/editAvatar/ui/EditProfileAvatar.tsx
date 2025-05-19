'use client';

import React, { memo } from "react";
import { Popup, type PopupProps } from "~/shared/ui/Popup";
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';
import { useDropzone } from "react-dropzone";
import { formatDate } from "~/features/editProfileResume/lib/formatDate";

export interface FileInfo {
    name: string,
    size: number,
    uploadedDate: string
}

export interface EditProfileAvatarProps extends Omit<PopupProps, 'title'> {
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

export const EditProfileAvatar: React.FC<EditProfileAvatarProps> = memo((props) => {
    const { fileInfo, handleRemoveFile, onDrop, setIsOpen } = props;
    const { name, size, uploadedDate } = fileInfo ? parseFileInfo(fileInfo) : {} as FileInfo;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
        multiple: false,
        noDrag: true 
    });

    return (
        <Popup title={"Редактирование аватарки"} {...props}>
            <div className="flex flex-col gap-y-8 w-full h-full items-end">
                {fileInfo && (
                    <div className="flex flex-col gap-y-2 w-full items-start">
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-row gap-x-1 justify-center">
                                <IconFile className="w-5 h-5 fill-sub" />
                                <span className="text-text text-14 font-600">{name}</span>
                            </div>
                            <IconTrash 
                                onClick={() => { handleRemoveFile(); setIsOpen(false); }} 
                                className="w-5 h-5 fill-red cursor-pointer" 
                            />
                        </div>
                        <div className="flex flex-row gap-x-4">
                            <p className="text-text text-14">
                                Размер: <span className="font-600">{size}</span>
                            </p>
                            <p className="text-text text-14">
                                Дата загрузки: <span className="font-600">{uploadedDate}</span>
                            </p>
                        </div>
                    </div>
                )}
                <div
                    {...getRootProps()}
                    className="group flex flex-col items-center justify-center w-full px-4 h-24 border-2 border-dashed border-mauve rounded-10 cursor-pointer min-w-popup-dragdrop bg-base hover:bg-text hover:border-base transition-colors"
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-text group-hover:text-base text-14 transition-colors">
                            Нажмите, чтобы выбрать новую аватарку
                        </p>
                        <p className="text-sub group-hover:text-crust text-12 transition-colors">
                            Поддерживаемые форматы: JPEG, PNG, WebP
                        </p>
                    </div>
                </div>
            </div>
        </Popup>
    );
});