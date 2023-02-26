import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiHome } from 'react-icons/fi';
import styles from './page.module.css';

export default function NotFoundPage() {
  const { query } = useRouter();
  const [typePage, setTypePage] = useState('default');

  const handleTypePage = () => {
    if (!query) {
      return 'default'
    } else {
      const key = Object.keys(query)[0];
      if (key === 'quiz') {
        return 'quiz';
      }
      if (key === 'search') {
        return 'search';
      }
    }
    return 'default'
  }
  useEffect(() => {
    const typePage = handleTypePage()
    setTypePage(typePage);
  }, [query])

  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFoundTitle}>404 - Conteúdo não encontrado</h1>
      {typePage === 'quiz' && (
        <div className={styles.notFoundInfo}>
          <span>Quiz de ID: {query[typePage]} não encontrado!</span>
          <Link href="/" className={styles.notFoundRedirectLink}>
            <span>Voltar para página inicial</span>
            <FiHome size={24} />
          </Link>
        </div>
      )}
      {typePage === 'default' && (
        <div className={styles.notFoundInfo}>
          <Link href="/" className={styles.notFoundRedirectLink}>
            <span>Voltar para página inicial</span>
            <FiHome size={24} />
          </Link>
        </div>
      )}

      {typePage === 'search' && (
        <div className={styles.notFoundInfo}>
          <span>Busca &ldquo;{query[typePage]}&rdquo; não encontrado(a)!</span>
          <Link href="/" className={styles.notFoundRedirectLink}>
            <span>Voltar para página inicial</span>
            <FiHome size={24} />
          </Link>
        </div>
      )}
    </div>
  )
}