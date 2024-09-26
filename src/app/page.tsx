'use client';
import Link from "next/link";
import {Button, ButtonView} from "~/shared/ui/Button";
import SettingsIcon from  '~/shared/assets/icons/settings-icon.svg';
 import DeleteIcon from  '~/shared/assets/icons/delete-icon.svg';

export default () => (
    <main
        className="flex min-h-screen flex-col gap-y-4   items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">

     <Button buttonView={ButtonView.SMALL} className={'text-base-dark bg-mauve-dark'}>
       {'Sign up / Log in'}
     </Button>
      <Button buttonView={ButtonView.LARGE} className={'!p-3 bg-mantle-dark'}  >
          <SettingsIcon  className={'w-full h-full'}/>
      </Button>
        <Button buttonView={ButtonView.LARGE} className={'bg-red-dark'}>
            <DeleteIcon className={'w-full h-full'}/>
            <span className={'text-base-dark'}>{'Delete'}</span>
        </Button>
    </main>
)
