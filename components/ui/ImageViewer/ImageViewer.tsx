'use client'

import { useEffect, useRef } from 'react'
import { useSpring, animated, to } from 'react-spring'
import { useGesture } from '@use-gesture/react'
import { useImageViewer } from '@/hooks/useImageViewer'
import styles from './ImageViewer.module.css'

export default function ImageViewer() {
  const { isOpen, currentImageUrl, closeViewer, nextImage, prevImage, currentIndex, images } = useImageViewer()
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ x, y, scale }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0, 
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 }
  }))

  // Reseta posição sempre que o índice muda (garante que a nova imagem comece centralizada)
  useEffect(() => {
    api.start({ x: 0, y: 0, scale: 1, immediate: true })
  }, [currentIndex, api])

  // Atalhos de teclado
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer()
      if (e.key === 'ArrowRight' && scale.get() === 1) nextImage()
      if (e.key === 'ArrowLeft' && scale.get() === 1) prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeViewer, nextImage, prevImage, scale])

  const bind = useGesture({
    onDrag: ({ active, movement: [mx, my], memo = scale.get() }) => {
      // 1. Lógica para Zoom (Panorâmica livre)
      if (memo > 1) {
        api.start({ x: active ? mx : 0, y: active ? my : 0, scale: memo, immediate: active })
        return memo
      }

      // 2. Lógica Normal (Navegação)
      // Definimos um limite (15% da tela ou 50px minimo) para considerar como troca
      const threshold = Math.max(50, window.innerWidth * 0.15)

      if (active) {
        // ENQUANTO ARRASTA: Apenas move a imagem visualmente. 
        // Não trocamos a imagem aqui para evitar "pulos" múltiplos.
        api.start({ x: mx, y: 0, scale: 1, immediate: true })
      } else {
        // AO SOLTAR: Decidimos o que fazer
        if (mx > threshold) {
          prevImage() // Troca para a ANTERIOR (apenas uma vez)
        } else if (mx < -threshold) {
          nextImage() // Troca para a PRÓXIMA (apenas uma vez)
        } else {
          // Se não arrastou o suficiente, volta para o centro
          api.start({ x: 0, y: 0, scale: 1 })
        }
      }
      return memo
    },
    onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s], memo }) => {
      if (first) {
        const { width, height, x, y } = containerRef.current!.getBoundingClientRect()
        const tx = ox - (x + width / 2)
        const ty = oy - (y + height / 2)
        memo = [scale.get(), tx, ty]
      }

      const newScale = Math.max(1, Math.min(s, 4))
      api.start({ scale: newScale, x: memo[1] * (1 - newScale), y: memo[2] * (1 - newScale) })
      return memo
    },
    onDoubleClick: ({ event }) => {
      event.stopPropagation()
      const currentScale = scale.get()
      
      if (currentScale > 1) {
        api.start({ x: 0, y: 0, scale: 1 })
      } else {
        api.start({ scale: 3, x: 0, y: 0 })
      }
    }
  }, {
    drag: { filterTaps: true, rubberband: true },
    pinch: { scaleBounds: { min: 1, max: 4 }, rubberband: true },
  })

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={closeViewer} />
      
      <button className={styles.closeBtn} onClick={closeViewer}>✕</button>

      <animated.div 
        ref={containerRef}
        className={styles.gestureContainer}
        {...bind()} 
        style={{
          transform: to([x, y, scale], (x, y, s) => `translate3d(${x}px, ${y}px, 0) scale(${s})`),
          touchAction: 'none'
        }}
      >
        <img 
          src={currentImageUrl} 
          alt="Fullscreen view" 
          className={styles.image}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </animated.div>
      
      {images.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}