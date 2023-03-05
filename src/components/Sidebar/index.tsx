import { useMenuContext } from '@/hooks/contexts/menuContext';
import Link from 'next/link';
import { FiCrosshair, FiGrid, FiHome, FiPhoneForwarded, FiStar } from 'react-icons/fi';
import styles from './Sidebar.module.scss';

export function Sidebar() {
  const {selectedMenu, setSelectedMenu} = useMenuContext()
  return (
    <aside className={styles.sidebar}>
      <article className={styles.sidebarItem}>
        <Link href="/" className={`${selectedMenu === 'inicio' && styles.selected}`} onClick={() => setSelectedMenu('inicio')}>
          <FiHome size={24} />
          <span>Inicio</span>
        </Link>
      </article>
      <article className={styles.sidebarItem}>
        <Link href="categories" className={`${selectedMenu === 'categorias' && styles.selected}`} onClick={() => setSelectedMenu('categorias')}>
          <FiGrid size={24} />
          <span>Categorias</span>
        </Link>
      </article>
      <article className={styles.sidebarItem}>
        <Link href="/answered" className={`${selectedMenu === 'respondidos' && styles.selected}`} onClick={() => setSelectedMenu('respondidos')}>
          <FiCrosshair size={24} />
          <span>Já respondidos</span>
        </Link>
      </article>
      <article className={styles.sidebarItem}>
        <Link href="/highlight" className={`${selectedMenu === 'alta' && styles.selected}`} onClick={() => setSelectedMenu('alta')}>
          <FiStar size={24} />
          <span>Quiz Em Alta</span>
        </Link>
      </article>
      <article className={styles.sidebarItem}>
        <Link href="/contact" className={`${selectedMenu === 'contato' && styles.selected}`} onClick={() => setSelectedMenu('contato')}>
          <FiPhoneForwarded size={24} />
          <span>Contato</span>
        </Link>
      </article>
    </aside>
  )
}