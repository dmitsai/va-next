'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import Button, { ButtonView } from '~/shared/ui/Button';

export const LogoutButton: React.FC = () => (
    <Button
        buttonView={ButtonView.SMALL}
        className="muted bg-mantle hover:bg-text hover:text-base"
        onClick={() => signOut({ callbackUrl: '/' })}
    >
        Выйти
    </Button>
);
