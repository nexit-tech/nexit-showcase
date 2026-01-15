'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface ImageViewerContextData {
  isOpen: boolean
  currentIndex: number
  images: string[]
  currentImageUrl: string
  openViewer: (index: number, allImages: string[]) => void
  closeViewer: () => void
  nextImage: () => void
  prevImage: () => void
  setCurrentIndex: (index: number) => void
}

const ImageViewerContext = createContext<ImageViewerContextData>({} as ImageViewerContextData)

export function ImageViewerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndexState] = useState(0)
  const [images, setImages] = useState<string[]>([])

  const openViewer = useCallback((index: number, allImages: string[]) => {
    setCurrentIndexState(index)
    setImages(allImages)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  }, [])

  const closeViewer = useCallback(() => {
    setIsOpen(false)
    setImages([])
    setCurrentIndexState(0)
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.touchAction = ''
  }, [])

  const setCurrentIndex = useCallback((index: number) => {
    setCurrentIndexState(index)
  }, [])

  const nextImage = useCallback(() => {
    setCurrentIndexState((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndexState((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const currentImageUrl = images[currentIndex] || ''

  return (
    <ImageViewerContext.Provider value={{ 
      isOpen, 
      currentIndex, 
      images, 
      currentImageUrl,
      openViewer, 
      closeViewer, 
      nextImage, 
      prevImage,
      setCurrentIndex
    }}>
      {children}
    </ImageViewerContext.Provider>
  )
}

export function useImageViewer() {
  return useContext(ImageViewerContext)
}