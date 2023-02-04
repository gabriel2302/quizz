import styles from './header.module.scss'

export default function Header() {
    return (
        <header className={styles.header}>
            <div>
              <h1 className={styles.logo}>Quizz</h1>
            </div>
            <div>
                <input placeholder="Pesquisar" className={styles.searchInput}></input>
            </div>
        </header>
    )
}