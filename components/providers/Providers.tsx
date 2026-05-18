'use client'

import { ClientsProvider } from '@/context/ClientsContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ClientsProvider>{children}</ClientsProvider>
}
