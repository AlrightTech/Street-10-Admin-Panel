import './globals.css'
import LanguageProviderWrapper from '@/components/providers/LanguageProviderWrapper'
import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MAZAD - Vendor Dashboard',
  description: 'Professional vendor dashboard for MAZAD marketplace',
  icons: {
    icon: '/images/sidebar-topicon.png',
    shortcut: '/images/sidebar-topicon.png',
    apple: '/images/sidebar-topicon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body>
        <LanguageProviderWrapper>
          {children}
        </LanguageProviderWrapper>
      </body>
    </html>
  )
}

