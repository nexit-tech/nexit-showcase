import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      {/* Lado Esquerdo: Identidade */}
      <div className={styles.identity}>
        <img 
          src="/logo.png" 
          alt="Nexit Logo" 
          className={styles.logo}
        />
        <p className={styles.tagline}>
          Desenvolvendo sua próxima solução tecnológica.
        </p>
        
        {/* Copyright discreto mobile/desktop */}
        <span className={styles.copyright}>
          © {currentYear} Nexit Tech
        </span>
      </div>

      {/* Lado Direito: Links */}
      <nav className={styles.nav}>
        <a href="mailto:contato@nexit.tech" className={styles.link}>
          Contato
        </a>
        
        <a 
          href="https://nexit.tech" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.link}
        >
          Website
        </a>

        {/* Adicionei o Instagram também, padrão de portfólio, se tiver */}
        {/* <a href="#" className={styles.link}>Instagram</a> */}
      </nav>
    </footer>
  )
}