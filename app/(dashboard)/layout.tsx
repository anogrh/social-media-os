import Sidebar from '@/components/layout/Sidebar'
import Providers from '@/components/providers/Providers'
import { SidebarProvider } from '@/context/SidebarContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FFFFFF' }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </Providers>
  )
}
