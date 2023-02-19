"use client";
import { useEffect } from 'react';
import styles from './BurguerMenu.module.scss';
import {
  FiX
} from "react-icons/fi";


type MenuProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function BurguerMenu(props: MenuProps) {
  const { children, isOpen, onClose } = props;

  function handleKeypress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === 27) {
      onClose();
    }
  }

  useEffect(() => {
    function fn(event: KeyboardEvent) {
      if (event.keyCode === 27) {
        onClose();
      }

      document.addEventListener('keydown', fn);

      return () => document.removeEventListener('keydown', fn);
    }
  }, [onClose]);

  return (
    <div>
      <div
        onClick={onClose}
        role="presentation"
        onKeyPress={handleKeypress}
        data-open={JSON.stringify(isOpen)}
        className={styles.overlay}
      ></div>

      <nav data-open={JSON.stringify(isOpen)} className={styles.menu}>
        <h1 className={styles.logo}>Quizz</h1>
        <button type="button" onClick={onClose} className={styles.buttonClose}>
          <FiX size={32}/>
        </button>
        {children}
      </nav>
    </div>
  )
}