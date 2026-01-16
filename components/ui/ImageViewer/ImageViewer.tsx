'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useImageViewer } from '@/hooks/useImageViewer'
import styles from './ImageViewer.module.css'

export default function ImageViewer() {
  const { isOpen, currentIndex, images, closeViewer, nextImage, prevImage, setImage } = useImageViewer()
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  // Suporte a teclado (ESC, Setas)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeViewer, nextImage, prevImage])

  // Auto-scroll nas thumbnails para manter a ativa visível
  useEffect(() => {
    if (isOpen && thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentIndex, isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && closeViewer()}
      >
        {/* Botão Fechar */}
        <button className={styles.closeBtn} onClick={closeViewer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {/* Botão Anterior */}
        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={(e) => { e.stopPropagation(); prevImage(); }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        {/* Imagem Principal */}
        <div className={styles.mainImageContainer}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`View ${currentIndex + 1}`}
              className={styles.mainImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x
                if (swipe < -100) nextImage()
                if (swipe > 100) prevImage()
              }}
            />
        </div>

        {/* Botão Próximo */}
        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={(e) => { e.stopPropagation(); nextImage(); }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Barra Inferior (Info + Miniaturas) */}
        <div className={styles.bottomBar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>

          <div className={styles.thumbnailsWrapper} ref={thumbnailsRef}>
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumb} ${idx === currentIndex ? styles.activeThumb : ''}`}
                onClick={() => setImage(idx)}
              >
                <img src={img} alt={`Thumb ${idx}`} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}