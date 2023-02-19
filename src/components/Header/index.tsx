import { useState } from 'react'
import { BurguerMenu } from '../BurguerMenu'
import styles from './header.module.scss'
import {
  FiCrosshair,
  FiGrid,
  FiStar,
  FiPhoneForwarded,
  FiMenu,
  FiHome
} from 'react-icons/fi';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState("inicio");
  
  function navigateMenu(item: string) {
    setIsOpen(false)
    setIsSelected(item);
  }
  
  return (
    <header className={styles.header}>
      <div>
        <button type='button' className={styles.burguerIcon} onClick={() => setIsOpen(!isOpen)}>
          <FiMenu size={32} />
        </button>
        <BurguerMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ul className={styles.burguerMenu} id="menuList">
            <Link href="/" onClick={() => navigateMenu("inicio")}>
              <li id="inicio" className={`${isSelected === "inicio" && styles.selectedItem}`}>
                <FiHome size={24} />
                <span>Inicio</span>
              </li>
            </Link>
            <Link href="/categories" onClick={() => navigateMenu("categorias")}>
              <li id="categorias" className={`${isSelected === "categorias" && styles.selectedItem}`}>
                <FiGrid size={24} />
                <span>Categorias</span>
              </li>
            </Link>
            <Link href="/answered" onClick={() => navigateMenu("respondidos")}>
              <li id="respondidos" className={`${isSelected === "respondidos" && styles.selectedItem}`}>
                <FiCrosshair size={24} />
                <span>Já respondidos</span>
              </li>
            </Link>
            <Link href="/" onClick={() => navigateMenu("alta")}>
              <li id="alta" className={`${isSelected === "alta" && styles.selectedItem}`}>
                <FiStar size={24} />
                <span>Quiz Em Alta</span>
              </li>
            </Link>
            <Link href="/" onClick={() => navigateMenu("contato")}>
              <li id="contato" className={`${isSelected === "contato" && styles.selectedItem}`}>
                <FiPhoneForwarded size={24} />
                <span>Contato</span>
              </li>
            </Link>
          </ul>
        </BurguerMenu>
      </div>
      <div>
        <input placeholder="Pesquisar" className={styles.searchInput}></input>
      </div>
    </header>
  )
}