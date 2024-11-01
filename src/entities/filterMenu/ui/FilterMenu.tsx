import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { PropsWithChildren, useState } from "react";
import { CONSTANTS } from "~/shared/lib/strings";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconSettings } from '~/shared/assets/icons/settings-icon.svg';
import { ReactComponent as IconXmark } from '~/shared/assets/icons/icon-x-mark.svg';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';
import { ReactComponent as IconSearch } from '~/shared/assets/icons/search-icon.svg';

export interface FilterMenuProps extends PropsWithChildren {
    clearOnClick: () => void;
    searchOnClick: () => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({ children, ...props }) => {
    const { clearOnClick, searchOnClick } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }
    return (
        <>
            <Button buttonView={ButtonView.LARGE} className={'group !p-3 bg-mantle hover:bg-text w-10 h-10 transition-colors'} onClick={handleOpen}>
                <IconSettings className={'absolute fill-text group-hover:fill-base'} />
            </Button>
            <Dialog open={isOpen} as="div" className={'relative z-10 focus:outline-none'} onClose={handleClose}>
                <DialogBackdrop transition className={'fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0'} />
                <div className={'fixed inset-0 flex w-screen items-center justify-center p-4'}>
                    <DialogPanel transition className="relative flex flex-col max-w-filter-menu w-full bg-base p-5 gap-y-10 rounded-10 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                        <div className={'flex flex-col gap-y-5 w-full'}>
                            <div className={'flex flex-row w-full justify-between item-start'}>
                                <h4 className={'text-text'}>
                                    {CONSTANTS.filterMenu.label}
                                </h4>
                                <Button buttonView={ButtonView.SMALL} onClick={handleClose} className={'group/close hover:bg-base'}>
                                    <IconXmark className={'absolute fill-sub-secondary/70 group-hover/close:fill-text'} />
                                </Button>
                            </div>
                            <div>
                                {children}
                            </div>
                        </div>
                        <div className={'flex flex-row w-full gap-x-5 justify-end items-center'}>
                            <Button buttonView={ButtonView.LARGE} className={'group/trash bg-mantle hover:bg-text'} onClick={clearOnClick}>
                                <IconTrash className={'fill-text group-hover/trash:fill-base transition-all'} />
                                <p className={'font-500 text-14 leading-6 text-text group-hover/trash:text-base transition-all'}>{CONSTANTS.filterMenu.clean}</p>
                            </Button>
                            <Button buttonView={ButtonView.LARGE} className={'bg-mauve'} onClick={() => { searchOnClick(); handleClose(); }} >
                                <IconSearch className={'fill-base'} />
                                <p className={'font-500 text-14 leading-6 text-base'}>{CONSTANTS.filterMenu.search}</p>
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}