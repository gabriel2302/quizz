import { Quizz } from "@/app/page"
import QuizItem from "../QuizItem"

import styles from './QuizList.module.scss'


export default function QuizList(list: Quizz[]) {
  const quizIdList = Object.keys(list)
  return (
    <>
    <div className={styles.quizList}>
      <h1>Lista de Quiz</h1>
      {quizIdList.map(item => (
        <div id={item} key={item} className={styles.quizItem}>
          <QuizItem {...list[Number(item)]}/>
        </div>
      ))}
    </div>
    </>
  )
}