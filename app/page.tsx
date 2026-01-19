// app/page.tsx
import FeaturedCarousel from '@/components/ui/FeaturedCarousel/FeaturedCarousel'
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle'
import Footer from '@/components/ui/Footer/Footer' // <--- Importe aqui
import { getShowcaseData } from '@/services/showcase'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await getShowcaseData()

  // ... (seus filtros continuam iguais) ...
  const featured = data.filter((item) => item.isFeatured)
  const remainder = data.filter((item) => !item.isFeatured)
  const nexitProjects = remainder.filter((item) => item.client.trim().toLowerCase().includes('nexit'))
  const clientProjects = remainder.filter((item) => !item.client.trim().toLowerCase().includes('nexit'))

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

      {/* SEÇÃO DESTAQUES */}
      {featured.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 className={styles.sectionTitle}>
             Projetos em <span>Destaque</span>
          </h2>
          <FeaturedCarousel items={featured} />
        </section>
      )}

      {/* SEÇÃO NOSSOS PRODUTOS */}
      {nexitProjects.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 className={styles.sectionTitle}>
            Nossos <span>Produtos</span>
          </h2>
          <p className={styles.sectionDescription}>
            Aplicações desenvolvidas para uso interno da Nexit, focadas em produtividade, automação e gestão dos nossos próprios processos.
          </p>
          <FeaturedCarousel items={nexitProjects} />
        </section>
      )}

      {/* SEÇÃO CLIENTES */}
      {clientProjects.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 className={styles.sectionTitle}>
            Projetos de <span>Clientes</span>
          </h2>
          <FeaturedCarousel items={clientProjects} />
        </section>
      )}

      {/* FOOTER NO FINAL */}
      <Footer />
      
    </main>
  )
}