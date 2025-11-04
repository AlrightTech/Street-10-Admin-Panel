'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { ReactNode } from 'react'

interface LanguageProviderWrapperProps {
  children: ReactNode
}

export default function LanguageProviderWrapper({ children }: LanguageProviderWrapperProps) {
  return <LanguageProvider>{children}</LanguageProvider>
}

