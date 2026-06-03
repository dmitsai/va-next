import '~/styles/globals.scss';
// eslint-disable-next-line import/no-unresolved
import { type Metadata } from 'next';

import type React from 'react';
// eslint-disable-next-line camelcase
import { JetBrains_Mono } from 'next/font/google';
import { TopBar } from '~/widgets/topBar';
import AppProviders from './providers/providers';

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jbm',
});
export const metadata: Metadata = {
  title: 'vakansiy.net',
  description: 'Vacancy Aggregator',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={`${jetBrainsMono.variable} !font-sans`}>
    <body className="flex h-screen min-h-screen flex-col">
      <AppProviders>
        {children}
      </AppProviders>
    </body>
  </html>
);
