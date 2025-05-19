'use client';

import { UploadButton, UploadDropzone } from '~/utils/uploadthing';
import React, { useEffect, useState } from 'react';
import { clientApi } from 'trpc/client';
import Image from 'next/image';
import { ReactComponent as LoadingIcon } from '~/shared/assets/icons/spin.svg';
import cn from 'classnames';

export const Avatar: React.FC<{
    userAvatarUrl?: string;
    className?: string;
}> = ({ userAvatarUrl, className }) => {
    const [isUploading, setIsUploading] = useState(false);
    const {
        data: avatarUrl,
        isLoading,
        isSuccess,
        refetch,
    } = clientApi.files.getAvatar.useQuery();

    return (
        <div className={cn('group relative h-20 w-20 rounded-full', className)}>
            {isSuccess && !avatarUrl && (
                <div
                    className={
                        'h-full w-full rounded-full bg-peach group-hover:bg-peach/70'
                    }
                />
            )}
            {isSuccess && !!avatarUrl && (
                <Image
                    src={avatarUrl ?? ''}
                    alt={'avatar'}
                    width={80}
                    height={80}
                    className={'rounded-full object-cover'}
                />
            )}
            {!userAvatarUrl && (
                <UploadDropzone
                    config={{ mode: 'auto' }}
                    endpoint="imageUploader"
                    className="absolute left-0 top-0 z-20 h-full w-full cursor-pointer rounded-full border-none opacity-0 transition-colors hover:bg-gray-100/50"
                    appearance={{
                        container: 'h-full w-full rounded-full !m-0',
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
            )}

            {(isUploading || isLoading) && (
                <div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center rounded-full bg-mantle">
                    <LoadingIcon className={'animate-spin'} />
                </div>
            )}
        </div>
    );
};
