import './globals.css'
import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google' // Verifique suas fontes
import { ImageViewerProvider } from '@/hooks/useImageViewer'
import ImageViewer from '@/components/ui/ImageViewer/ImageViewer'

const inter = Inter({ subsets: ['latin'], variable: '--font-text' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-title' })

export const metadata: Metadata = {
  title: 'Nexit Portfolio',
  description: 'Showcase de projetos Nexit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        {/* ENVOLVA TUDO COM O PROVIDER */}
        <ImageViewerProvider>
          {children}
          
          {/* ADICIONE O COMPONENTE AQUI PARA ELE EXISTIR NA TELA */}
          <ImageViewer />
          
        </ImageViewerProvider>
      </body>
    </html>
  )
}