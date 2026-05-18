import Sidebar from '@/components/layout/Sidebar'
import Providers from '@/components/providers/Providers'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FFFFFF' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </Providers>
  )
}
