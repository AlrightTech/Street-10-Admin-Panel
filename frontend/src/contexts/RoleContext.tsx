'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'vendor' | 'sub-admin' | 'super-admin'

interface RoleContextType {
  role: UserRole | null
  setRole: (role: UserRole | null) => void
  isVendor: boolean
  isSubAdmin: boolean
  isSuperAdmin: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null)

  useEffect(() => {
    // Load saved role preference from localStorage
    const savedRole = localStorage.getItem('dashboard_role') as UserRole | null
    if (savedRole && ['vendor', 'sub-admin', 'super-admin'].includes(savedRole)) {
      setRoleState(savedRole)
    }
  }, [])

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole)
    if (newRole) {
      localStorage.setItem('dashboard_role', newRole)
    } else {
      localStorage.removeItem('dashboard_role')
    }
  }

  const value: RoleContextType = {
    role,
    setRole,
    isVendor: role === 'vendor',
    isSubAdmin: role === 'sub-admin',
    isSuperAdmin: role === 'super-admin',
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}

