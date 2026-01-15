'use client'

import { useState, useRef, MouseEvent } from 'react'
import { ShowcaseItem } from '@/types'
import { useImageViewer } from '@/hooks/useImageViewer'
import styles from './ShowcaseCard.module.css'

interface Props {
  item: ShowcaseItem
}

type ViewMode = 'mobile' | 'desktop'

export default function ShowcaseCard({ item }: Props) {
  const { openViewer } = useImageViewer()
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isDragging = useRef(false)

  const initialMode: ViewMode = item.mobileImages.length === 0 && item.desktopImages.length > 0 
    ? 'desktop' 
    : 'mobile'

  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [isSwitching, setIsSwitching] = useState(false)
  
  const currentImages = mode === 'mobile' ? item.mobileImages : item.desktopImages
  const hasBothVersions = item.mobileImages.length > 0 && item.desktopImages.length > 0

  const handleModeSwitch = (targetMode: ViewMode) => {
    if (mode === targetMode || isSwitching) return
    setIsSwitching(true)
    setTimeout(() => {
      setMode(targetMode)
      setTimeout(() => setIsSwitching(false), 50)
    }, 300)
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (!carouselRef.current) return
    isDown.current = true
    isDragging.current = false
    carouselRef.current.classList.add(styles.active)
    startX.current = e.pageX - carouselRef.current.offsetLeft
    scrollLeft.current = carouselRef.current.scrollLeft
  }

  const handleMouseLeave = () => {
    if (!carouselRef.current) return
    isDown.current = false
    carouselRef.current.classList.remove(styles.active)
  }

  const handleMouseUp = () => {
    if (!carouselRef.current) return
    isDown.current = false
    carouselRef.current.classList.remove(styles.active)
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX.current) * 2
    
    if (Math.abs(x - startX.current) > 5) {
      isDragging.current = true
    }
    
    carouselRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleImageClick = (imgUrl: string, allImages: string[]) => {
    if (isDragging.current) return
    const index = allImages.indexOf(imgUrl)
    if (index >= 0) {
      openViewer(index, allImages)
    }
  }

  if (item.mobileImages.length === 0 && item.desktopImages.length === 0) return null 

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.client}>{item.client}</span>
          <h3 className={styles.title}>{item.title}</h3>
        </div>

        {hasBothVersions && (
          <div className={styles.toggle}>
            <button 
              className={`${styles.toggleBtn} ${mode === 'mobile' ? styles.active : ''}`}
              onClick={() => handleModeSwitch('mobile')}
              disabled={isSwitching}
              aria-label="Ver Mobile"
            >
              <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                <path d="M10 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H10C11.1 20 12 19.1 12 18V2C12 0.9 11.1 0 10 0ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17C4.5 16.17 5.17 15.5 6 15.5C6.83 15.5 7.5 16.17 7.5 17C7.5 17.83 6.83 18.5 6 18.5ZM10 14H2V2H10V14Z"/>
              </svg>
            </button>
            <button 
              className={`${styles.toggleBtn} ${mode === 'desktop' ? styles.active : ''}`}
              onClick={() => handleModeSwitch('desktop')}
              disabled={isSwitching}
              aria-label="Ver Desktop"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor">
                <path d="M0 0V12H20V0H0ZM18 10H2V2H18V10ZM0 14H20V16H0V14Z"/>
              </svg>
            </button>
          </div>
        )}
      </header>

      <div className={styles.carouselWrapper}>
        <div 
          ref={carouselRef}
          className={`
            ${styles.carousel} 
            ${mode === 'desktop' ? styles.desktopMode : ''}
            ${isSwitching ? styles.hidden : ''}
          `}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {currentImages.map((imgUrl, index) => (
            <div key={`${mode}-${index}`} className={styles.slide}>
              <img 
                src={imgUrl} 
                alt={`${item.title} ${mode} view ${index + 1}`} 
                className={styles.image}
                loading="lazy"
                draggable={false}
                onClick={() => handleImageClick(imgUrl, currentImages)}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>
        
        {isSwitching && <div className={styles.loader} />}
      </div>

      <footer className={styles.footer}>
        <div className={styles.tags}>
          {item.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </footer>
    </article>
  )
}