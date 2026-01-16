'use client'

import { useState, useRef, useEffect } from 'react'
import { ShowcaseItem } from '@/types'
import { useImageViewer } from '@/hooks/useImageViewer'
import styles from './ShowcaseCard.module.css'
import { motion, Variants } from 'framer-motion'

interface Props {
  item: ShowcaseItem
  customDirection?: number
}

type ViewMode = 'mobile' | 'desktop'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
}

const itemVariants: Variants = {
  hidden: (direction: number) => ({ x: direction >= 0 ? 100 : -100, opacity: 0, filter: 'blur(4px)' }),
  visible: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', damping: 20, stiffness: 100 } },
  exit: { opacity: 0 }
}

export default function ShowcaseCard({ item, customDirection = 0 }: Props) {
  const { openViewer } = useImageViewer()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  // Define modo inicial
  const initialMode: ViewMode = (item.mobileImages && item.mobileImages.length > 0) ? 'mobile' : 'desktop'
  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [isSwitching, setIsSwitching] = useState(false)
  
  const mobileImages = item.mobileImages || []
  const desktopImages = item.desktopImages || []
  const currentImages = mode === 'mobile' ? mobileImages : desktopImages
  const hasBothVersions = mobileImages.length > 0 && desktopImages.length > 0

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
    }
    // Debug no console do navegador para te ajudar
    if (currentImages.length > 0) {
      console.log(`📸 [${item.title}] Renderizando ${currentImages.length} imagens no modo ${mode}`)
    }
  }, [mode, currentImages, item.title])

  const handleModeSwitch = (targetMode: ViewMode) => {
    if (mode === targetMode || isSwitching) return
    setIsSwitching(true)
    setTimeout(() => {
      setMode(targetMode)
      setTimeout(() => setIsSwitching(false), 50)
    }, 300)
  }

  return (
    <motion.article 
      className={styles.card}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={customDirection}
    >
      <motion.header className={styles.header} variants={itemVariants} custom={customDirection}>
        <div className={styles.meta}>
          <span className={styles.client}>{item.client}</span>
          <h3 className={styles.title}>{item.title}</h3>
        </div>

        {hasBothVersions && (
          <div className={styles.toggle}>
            {/* VOLTARAM OS ÍCONES AQUI */}
            <button 
              className={`${styles.toggleBtn} ${mode === 'mobile' ? styles.active : ''}`}
              onClick={() => handleModeSwitch('mobile')}
              disabled={isSwitching}
              aria-label="Ver Mobile"
            >
              <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor"><path d="M10 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H10C11.1 20 12 19.1 12 18V2C12 0.9 11.1 0 10 0ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17C4.5 16.17 5.17 15.5 6 15.5C6.83 15.5 7.5 16.17 7.5 17C7.5 17.83 6.83 18.5 6 18.5ZM10 14H2V2H10V14Z"/></svg>
            </button>
            <button 
              className={`${styles.toggleBtn} ${mode === 'desktop' ? styles.active : ''}`}
              onClick={() => handleModeSwitch('desktop')}
              disabled={isSwitching}
              aria-label="Ver Desktop"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor"><path d="M0 0V12H20V0H0ZM18 10H2V2H18V10ZM0 14H20V16H0V14Z"/></svg>
            </button>
          </div>
        )}
      </motion.header>

      <div className={styles.carouselWrapper}>
        {currentImages.length === 0 ? (
           <div style={{ padding: '2rem', textAlign: 'center', color: '#666', border: '1px dashed #333', borderRadius: '8px', margin: '0 1.5rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             Aguardando imagens... (Verifique o console)
           </div>
        ) : (
          <motion.div 
            ref={carouselRef}
            className={`
              ${styles.carousel} 
              ${mode === 'desktop' ? styles.desktopMode : ''}
              ${isSwitching ? styles.hidden : ''}
            `}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.1}
            whileTap={{ cursor: "grabbing" }}
            variants={containerVariants} 
          >
            {currentImages.map((imgUrl, index) => (
              <motion.div 
                key={`${item.id}-${mode}-${index}`}
                className={styles.slide}
                variants={itemVariants}
                custom={customDirection}
                onClick={() => {
                    console.log("Abrindo viewer para:", imgUrl)
                    openViewer(index, currentImages)
                }}
              >
                {/* FORÇANDO DISPLAY BLOCK, TAMANHO TOTAL E ZOOM (Cover) */}
                <img 
                  src={imgUrl} 
                  alt={`${item.title} ${index}`} 
                  className={styles.image}
                  loading="eager"
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  onError={(e) => {
                      console.error(`❌ Falha ao carregar [${index}]:`, imgUrl);
                      e.currentTarget.style.border = '2px solid red'; // Borda vermelha se falhar
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.footer className={styles.footer} variants={itemVariants} custom={customDirection}>
        <div className={styles.tags}>
          {item.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
      </motion.footer>
    </motion.article>
  )
}