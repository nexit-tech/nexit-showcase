import ShowcaseCard from '@/components/ui/ShowcaseCard/ShowcaseCard'
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle'
import { getShowcaseData } from '@/services/showcase'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await getShowcaseData()

  return (
    <main className={styles.main}>
      <div className={styles.topBar}>
        <ThemeToggle />
      </div>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          NEXIT <br />
          <span className={styles.highlight}>PORTFOLIO</span>
        </h1>
        <p className={styles.subtitle}>
          Todos as aplicações desenvolvidas pela Nexit.
        </p>
      </section>

      <div className={styles.feed}>
        {data.length > 0 ? (
          data.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))
        ) : (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Nenhum projeto público encontrado.
          </p>
        )}
      </div>
    </main>
  )
}