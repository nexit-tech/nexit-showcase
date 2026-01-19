// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { ImageViewerProvider } from '@/hooks/useImageViewer'
import ImageViewer from '@/components/ui/ImageViewer/ImageViewer'

const inter = Inter({ subsets: ['latin'], variable: '--font-text' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-title' })

export const metadata: Metadata = {
  title: 'Nexit Portfolio',
  description: 'Showcase de projetos Nexit',
  icons: {
    icon: '/logo.svg',       // Ícone padrão (aba do navegador)
    shortcut: '/logo.svg',   // Atalho
    apple: '/logo.svg',      // Ícone para iPhone/iPad (aqui ele fica grande)
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        <ImageViewerProvider>
          {children}
          <ImageViewer />
        </ImageViewerProvider>
      </body>
    </html>
  )
}