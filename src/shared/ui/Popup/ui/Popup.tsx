'use client';

import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ReactComponent as CloseIcon } from '~/shared/assets/icons/icon-x-mark.svg';

export interface PopupProps extends React.PropsWithChildren {
    title: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const Popup: React.FC<PopupProps> = props => {
    const { isOpen, setIsOpen, title, children } = props;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as='div'
                onClose={() => {
                    setIsOpen(false);
                }}
                className={'fixed inset-0 z-50 flex items-center justify-center focus:outline-none'}
            >
                <DialogBackdrop className={'fixed inset-0 h-auto w-auto bg-black/30 opacity-0'} />
                <TransitionChild
                    as={Fragment}
                    enter={'ease-out duration-300'}
                    enterFrom={'opacity-0'}
                    enterTo={'opacity-100'}
                    leave={'ease-in duration-200'}
                    leaveFrom={'opacity-100'}
                    leaveTo={'opacity-0'}
                >
                    <div className={'fixed inset-0 h-auto w-auto  bg-black bg-opacity-50'} />
                </TransitionChild>
                <TransitionChild
                    as={Fragment}
                    enter={'ease-out duration-300'}
                    enterFrom={'opacity-0 scale-90'}
                    enterTo={'opacity-100 scale-100'}
                    leave={'ease-in duration-200'}
                    leaveFrom={'opacity-100 scale-100'}
                    leaveTo={'opacity-0 scale-90'}
                >
                    <DialogPanel className='relative flex flex-col gap-y-6 w-fit max-w-popup rounded-16 pt-8 pb-4 px-8 bg-base'>
                        <CloseButton className={'absolute right-3 top-3'}>
                            <CloseIcon className={'2 w-4 h-4 fill-sub'} />
                        </CloseButton>
                        <DialogTitle className={'text-start text-20 text-text'}>{title}</DialogTitle>
                        <div className={'items-center justify-center w-full'}>{children}</div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
};