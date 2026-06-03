'use client';

import React, { memo, useState } from 'react';
import { Popup, type PopupProps } from '~/shared/ui/Popup';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';
import { ReactComponent as LoadingIcon } from '~/shared/assets/icons/spin.svg';

import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import { clientApi } from 'trpc/client';
import { UploadDropzone } from '~/utils/uploadthing';
import { formatDate } from '../lib/formatDate';

export interface FileInfo {
    name: string;
    size: number;
    uploadedDate: string;
}

export interface EditProfileResumeProps extends Omit<PopupProps, 'title'> {
    fileUrl: string | null;
    fileInfo: FileInfo | null;
    handleRefetch: () => void;
}

const parseFileInfo = (fileInfo: FileInfo) => ({
    name: fileInfo.name,
    size: `${(fileInfo.size / 1024).toFixed(2)} КБ `,
    uploadedDate: formatDate(fileInfo.uploadedDate),
});
export const EditProfileResume: React.FC<EditProfileResumeProps> = memo(
    (props) => {
        const [isUploading, setIsUploading] = useState(false);
        const { mutateAsync: deletePdf, isPending } =
            clientApi.files.deletePdf.useMutation();
        const { fileInfo, setIsOpen, handleRefetch } = props;
        const { name, size, uploadedDate } = fileInfo
            ? parseFileInfo(fileInfo)
            : ({} as FileInfo);

        const handleRemoveFile = async () => {
            await deletePdf();
        };
        return (
            <Popup title={'Редактирование резюме'} {...props}>
                <div
                    className={'flex h-full w-full flex-col items-end gap-y-8'}
                >
                    {fileInfo && (
                        <div
                            className={
                                'flex w-full flex-col items-start gap-y-2'
                            }
                        >
                            <div
                                className={
                                    'flex w-full flex-row justify-between'
                                }
                            >
                                <div
                                    className={
                                        'flex flex-row justify-center gap-x-1'
                                    }
                                >
                                    <IconFile className={'h-5 w-5 fill-sub'} />
                                    <span
                                        className={'text-14 font-600 text-text'}
                                    >
                                        {name}
                                    </span>
                                </div>
                                <IconTrash
                                    onClick={async () => {
                                        await handleRemoveFile();
                                        handleRefetch();
                                        setIsOpen(false);
                                    }}
                                    className={
                                        'h-5 w-5 cursor-pointer fill-red'
                                    }
                                />
                            </div>
                            <div className={'flex flex-row gap-x-4'}>
                                <p className={'text-14 text-text'}>
                                    {'Размер: '}
                                    <span className={'font-600'}>{size}</span>
                                </p>
                                <p className={'text-14 text-text'}>
                                    {'Дата загрузки: '}
                                    <span className={'font-600'}>
                                        {uploadedDate}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                    <div
                        className={cn(
                            'group flex h-24 w-full min-w-popup-dragdrop cursor-pointer flex-col items-center justify-center rounded-10 border-2 border-dashed px-4',
                            'border-green-500 bg-green-500',
                            'transition-colors hover:border-base hover:bg-text'
                        )}
                    >
                        {!isPending ? (
                            <div className="relative flex flex-col items-center justify-center">
                                <p
                                    className={
                                        'text-14 text-text transition-colors group-hover:text-base'
                                    }
                                >
                                    {
                                        'Перетащите файл сюда или нажмите, чтобы изменить резюме'
                                    }
                                </p>
                                <p
                                    className={
                                        'text-12 text-sub transition-colors group-hover:text-crust'
                                    }
                                >
                                    {'Только PDF файлы'}
                                </p>
                                <UploadDropzone
                                    config={{ mode: 'auto' }}
                                    endpoint="pdfUploader"
                                    className="left-30 top-15 absolute z-30 h-full w-full cursor-pointer opacity-0"
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
                                        setIsOpen(false);
                                        handleRefetch();
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                        ) : (
                            <LoadingIcon className={'animate-spin'} />
                        )}
                    </div>
                </div>
            </Popup>
        );
    }
);
