import FeaturedCarousel from '@/components/ui/FeaturedCarousel/FeaturedCarousel' // <--- Novo Import
import ShowcaseCard from '@/components/ui/ShowcaseCard/ShowcaseCard'
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle'
import { getShowcaseData } from '@/services/showcase'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await getShowcaseData()

  // Separa: Destaques vs O Resto
  const featured = data.filter((item) => item.isFeatured)
  const others = data.filter((item) => !item.isFeatured)

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
          Todas as aplicações desenvolvidas pela Nexit.
        </p>
      </section>

      {/* ÁREA DE DESTAQUE (Carrossel Interativo) */}
      {featured.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 className={styles.sectionTitle}>
             Projetos em <span>Destaque</span>
          </h2>
          {/* O componente cuida de mostrar 1 por 1 com setas */}
          <FeaturedCarousel items={featured} />
        </section>
      )}

      {/* LISTA DE OUTROS PROJETOS (Abaixo, normal) */}
      {others.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>
            Outros Projetos
          </h2>
          <div className={styles.feed}>
            {others.map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}