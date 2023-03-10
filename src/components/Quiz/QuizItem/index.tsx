import Image from 'next/image'
import Link from 'next/link'
import { Quizz } from "../../../pages"

import styles from './QuizItem.module.scss'

export default function QuizItem({attributes, id}: Quizz) {
  return (
    <div className={styles.quizItem}>
      <Link href={`quiz/${id}`} style={{position: 'relative'}}>
        <Image
          className={styles.image} 
          fill
          priority
          style={{ objectFit: 'cover'}}
          alt={attributes.cover.data.attributes.alternativeText || 'Sem texto alternativo, sinto muito'} 
          src={attributes.cover.data.attributes.url}
        />
        <h2 className={styles.description}>{attributes.title}</h2>
        </Link>
    </div>
  )
}