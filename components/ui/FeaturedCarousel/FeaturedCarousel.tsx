'use client'

import { useState } from 'react'
import { ShowcaseItem } from '@/types'
import ShowcaseCard from '../ShowcaseCard/ShowcaseCard'
import styles from './FeaturedCarousel.module.css'
import { AnimatePresence } from 'framer-motion'

interface FeaturedCarouselProps {
  items: ShowcaseItem[]
}

export default function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!items || items.length === 0) return null

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Botões de Navegação */}
      {items.length > 1 && (
        <>
          <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      <div className={styles.cardWrapper}>
        {/* O mode="wait" espera o card velho sair antes do novo entrar */}
        <AnimatePresence mode="wait" custom={direction}>
          <ShowcaseCard 
            key={items[currentIndex].id} // A Key é CRUCIAL para recriar o componente
            item={items[currentIndex]} 
            customDirection={direction} // Passamos a direção para o card animar certo
          />
        </AnimatePresence>
      </div>

      {/* Indicadores */}
      <div className={styles.indicators}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1)
              setCurrentIndex(idx)
            }}
          />
        ))}
      </div>
    </div>
  )
}