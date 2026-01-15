import styles from './loading.module.css'

export default function Loading() {
  return (
    <main className={styles.main}>
      <div className={styles.heroSkeleton}>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLineShort}></div>
        <div className={styles.subtitleLine}></div>
      </div>

      <div className={styles.feedSkeleton}>
        {[1, 2].map((i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div className={styles.headerSkeleton}>
              <div className={styles.metaSkeleton}>
                <div className={styles.clientLine}></div>
                <div className={styles.projectLine}></div>
              </div>
              <div className={styles.toggleSkeleton}></div>
            </div>
            
            <div className={styles.imageSkeleton}></div>
            
            <div className={styles.footerSkeleton}>
              <div className={styles.tagSkeleton}></div>
              <div className={styles.tagSkeleton}></div>
              <div className={styles.tagSkeleton}></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}