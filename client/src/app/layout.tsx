"use client"

import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/redux/provider';
import AuthWrapper from '@/components/auth/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
