import { useRouter } from 'next/router'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import styles from './answered.module.scss';
import Link from 'next/link';
import { FiLink } from 'react-icons/fi';
import Button from '@/components/Button';


type AnshweredQuiz = {
  data: {
    quiz: number;
    correctQuestions: number;
    totalQuestions: number;
    thumbnail: string;
    description: string;
    alternativeText: string;
  },
  amount: number;
}

interface GroupAnshweredQuiz extends AnshweredQuiz {
  amount: number;
}

export default function Anshwered() {
  const [quizAnswered, setQuizAnshwered] = useLocalStorage<AnshweredQuiz[]>('quizAnswered', []);
  const [groupQuiz, setGroupQuiz] = useState<GroupAnshweredQuiz[]>([]);
  const { push } = useRouter();
  useEffect(() => {
    const groupQuizReduce = quizAnswered.reduce((acc, curr) => {
      const quiz = acc.findIndex(item => item.data.quiz === curr.data.quiz)
      if (quiz === -1) {
        acc.push({ ...curr, amount: 1 })
      } else {
        const amount = acc[quiz].amount + 1;
        if (acc[quiz].data.correctQuestions < curr.data.correctQuestions) {
          acc[quiz] = { ...curr, amount }
        } else {
          acc[quiz].amount = amount;
        }
      }
      return acc;
    }, [] as GroupAnshweredQuiz[]);
    setGroupQuiz(groupQuizReduce);
  }, [])
  return (
    <>
      <div className={`${styles.answeredBox} main-content`}>
        <h1 className={styles.title}>Quiz já respondidos</h1>

        <div className={styles.quizListBox}>
          {groupQuiz.length === 0 ? (
            <div className={styles.description}>
              <span>Você ainda não respondeu nenhum quiz, responda algum aqui
                <Link href="/" aria-describedby='Link para a lista de quiz'>
                  <FiLink size={24} />
                </Link>
              </span>
            </div>
          ) : (
            <div>
              {groupQuiz.map(quiz => (
                <div key={quiz.data.quiz} className={styles.answeredBoxItem}>
                  <h2 className={styles.titleSecondary}>{quiz.data.description}</h2>
                  <div className={styles.descriptionBox}>
                    <span className={styles.description}>Feito <span className={styles.amount}>{quiz.amount}</span> {quiz.amount > 1 ? 'vezes' : 'vez'} </span>
                    <span className={styles.description}>
                      Melhor resultado:
                      <span className={styles.amount}>  {quiz.data.correctQuestions}  </span>
                      de
                      <span className={styles.amount}>  {quiz.data.totalQuestions}</span>
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Image
                      className={styles.image}
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                      alt={quiz.data.alternativeText}
                      src={quiz.data.thumbnail}
                      sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
                    />
                  </div>
                  <div style={{marginTop: '0.8rem', alignSelf: 'flex-end'}}>
                    <Button className={styles.button} role="link" onClick={() => push(`/quiz/${quiz.data.quiz}`)}>Refazer</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


