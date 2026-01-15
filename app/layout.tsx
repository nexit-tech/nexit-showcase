import type { Metadata } from 'next'
import { ImageViewerProvider } from '@/hooks/useImageViewer'
import { ThemeProvider } from '@/hooks/useTheme'
import ImageViewer from '@/components/ui/ImageViewer/ImageViewer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexit Showcase',
  description: 'Portfolio de produtos digitais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <ImageViewerProvider>
            {children}
            <ImageViewer />
          </ImageViewerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}