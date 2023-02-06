import Image from 'next/image'
import Link from 'next/link'
import { Quizz } from "@/app/page"

import styles from './QuizItem.module.scss'

export default function QuizItem({attributes, id}: Quizz) {
  return (
    <div className={styles.quizItem}>
      <Link href={`quiz/${id}`}>
        <Image
          className={styles.image} 
          layout='fill'
          objectFit='cover'
          alt={attributes.cover.data.attributes.alternativeText} 
          src={attributes.cover.data.attributes.url}
        />
        <h2 className={styles.description}>{attributes.title}</h2>
        </Link>
    </div>
  )
}