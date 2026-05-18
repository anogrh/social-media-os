import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rhania Araújo — Social Media OS',
  description: 'Plataforma de gestão de social media da Rhania Araújo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
