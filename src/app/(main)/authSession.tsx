'use client';

import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

export const AuthSession = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return null;
  if (session) return null;
  
  return children;
};