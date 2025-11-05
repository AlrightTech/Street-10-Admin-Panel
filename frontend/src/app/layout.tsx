import './globals.css'
import LanguageProviderWrapper from '@/components/providers/LanguageProviderWrapper'
import { RoleProvider } from '@/contexts/RoleContext'
import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Street 10 - Vendor Dashboard',
  description: 'Professional vendor dashboard for Street 10',
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
          <RoleProvider>
            {children}
          </RoleProvider>
        </LanguageProviderWrapper>
      </body>
    </html>
  )
}

