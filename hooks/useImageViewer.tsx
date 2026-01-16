'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ImageViewerContextData {
  isOpen: boolean
  currentIndex: number
  images: string[]
  openViewer: (index: number, allImages: string[]) => void
  closeViewer: () => void
  nextImage: () => void
  prevImage: () => void
  setImage: (index: number) => void
}

const ImageViewerContext = createContext<ImageViewerContextData>({} as ImageViewerContextData)

export function ImageViewerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState<string[]>([])

  const openViewer = (index: number, allImages: string[]) => {
    console.log("🚀 ABRINDO VIEWER COM", allImages.length, "IMAGENS") // Log de debug
    setImages(allImages)
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeViewer = () => setIsOpen(false)

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  const setImage = (index: number) => setCurrentIndex(index)

  return (
    <ImageViewerContext.Provider value={{ isOpen, currentIndex, images, openViewer, closeViewer, nextImage, prevImage, setImage }}>
      {children}
    </ImageViewerContext.Provider>
  )
}

export const useImageViewer = () => useContext(ImageViewerContext)