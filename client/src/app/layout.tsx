"use client"

import { Montserrat } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/redux/provider';
import AuthWrapper from '@/components/auth/AuthWrapper';

const montserrat = Montserrat({ weight: ['400'], subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ReduxProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
