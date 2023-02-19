import { Quizz } from "../../../pages/"
import QuizItem from "../QuizItem"

import styles from './QuizList.module.scss'


export default function QuizList(list: Quizz[]) {
  const quizIdList = Object.keys(list)
  return (
    <>
    <div className={styles.quizList}>
      <h2 className={styles.title}>Lista de Quiz</h2>
      {quizIdList.map(item => (
        <div id={item} key={item} className={styles.quizItem}>
          <QuizItem {...list[Number(item)]}/>
        </div>
      ))}
    </div>
    </>
  )
}