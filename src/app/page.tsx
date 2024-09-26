'use client';
import Link from "next/link";
import {Button, ButtonView} from "~/shared/ui/Button";
import SettingsIcon from  '~/shared/assets/icons/settings-icon.svg';
import SettingLightIcon from  '~/shared/assets/icons/settings-light-icon.svg';
 import DeleteIcon from  '~/shared/assets/icons/delete-icon.svg';

export default () => (
    <main
        className="flex min-h-screen flex-col gap-y-4   items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
     <Button buttonView={ButtonView.SMALL} className={'text-base-dark bg-mauve-dark hover:bg-text-dark transition-colors'}>
       {'Sign up / Log in'}
     </Button>
      <Button buttonView={ButtonView.LARGE} className={'group !p-3 bg-mantle-dark hover:bg-text-dark w-10 transition-colors'}  >
          <SettingsIcon  className={'absolute w-4 h-4 visible group-hover:invisible'}/>
          <SettingLightIcon  className={'absolute w-4 h-4 invisible group-hover:visible'}/>
      </Button>
        <Button buttonView={ButtonView.LARGE} className={'bg-red-dark hover:bg-text-dark transition-colors'}>
            <DeleteIcon className={'w-full h-full'}/>
            <span className={'text-base-dark'}>{'Delete'}</span>
        </Button>
    </main>
)
