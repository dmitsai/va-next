'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import Image from 'next/image';
import { EditProfileAvatar, FileInfo } from '~/features/editAvatar/ui/EditProfileAvatar';


export const ProfileAvatarUploader = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

    useEffect(() => {
        const avatar = localStorage.getItem('avatar');
        const avatarInfo = localStorage.getItem('avatarInfo');

        if (avatar) {
            setAvatarUrl(avatar);
        }
        if (avatarInfo) {
            try {
                setFileInfo(JSON.parse(avatarInfo) as FileInfo);
            } catch {
                localStorage.removeItem('avatarInfo');
                setFileInfo(null);
                throw new Error('File not defined after selection');
            }
        }
    }, []);

    const onDrop = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];

            if (file) {
                const newAvatarInfo: FileInfo = {
                    name: file.name,
                    size: file.size,
                    uploadedDate: new Date().toDateString(),
                };
                setFileInfo(newAvatarInfo);
                localStorage.setItem('avatarInfo', JSON.stringify(newAvatarInfo));

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target?.result as string;
                    localStorage.setItem('avatar', base64String);
                    setAvatarUrl(base64String);
                };
                reader.readAsDataURL(file);
            } else {
                throw new Error('File not defined after selection')
            }
        } else {
            setAvatarUrl(null);
            localStorage.removeItem('avatar');
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
        multiple: false,
        noDrag: true
    });

    const handleDeleteAvatar = () => {
        setAvatarUrl(null);
        localStorage.removeItem('avatar');
    };

    return (
        <>
            {avatarUrl &&
                <EditProfileAvatar
                    fileUrl={avatarUrl}
                    fileInfo={fileInfo}
                    handleRemoveFile={handleDeleteAvatar}
                    onDrop={onDrop}
                    isOpen={isEditMode}
                    setIsOpen={setIsEditMode}
                />
            }
            <div className="relative w-20 h-20 rounded-20 overflow-hidden">
                {avatarUrl ? (
                    <>
                        <Image
                            src={avatarUrl} 
                            alt="Profile avatar" 
                            className="w-full h-full object-cover"
                            onClick={() => setIsEditMode(true)}
                            width={80}
                            height={80}
                        />
                        <IconEdit 
                            className="absolute right-0 bottom-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer" 
                            onClick={() => setIsEditMode(true)} 
                        />
                    </>
                ) : (
                    <div
                        {...getRootProps()}
                        className="w-full h-full bg-rosewater flex items-center justify-center text-14 text-text cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        <span>AVATAR</span>
                    </div>
                )}
            </div>
        </>
    );
};