import styles from './page.module.css'
import { CSSProperties, useEffect, useState } from 'react'

import QuizList from '../components/Quiz/QuizList'
import { PacmanLoader } from 'react-spinners';


export type QuizzAttributes = {
  title: string;
  description: string;
  littleKnowledge: string;
  mediumKnowledge: string;
  fullKnowledge: string;
  cover: {
    data: {
      attributes: {
        alternativeText: string;
        url: string
      }
    }
  }
}

export type Quizz = {
  id: number;
  attributes: QuizzAttributes
}

const override: CSSProperties = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  position: 'absolute'
};

export default function Home() {
  const [data, setData] = useState<Quizz[]>()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?populate[0]=cover`, { cache: 'force-cache'})
      const data = await response.json()
      setData(data.data)
      setIsLoading(false)
    }
    fetchData()
  }, []);

  return (
    <main className={styles.main} style={{position: 'relative'}}>
      {!isLoading ? (
        data && (<div className={styles.quizListBox}><QuizList {...data} /></div>)
      ) : (
        <div className="sweet-loading">
          <PacmanLoader
            color='#88aaee'
            loading={isLoading}
            cssOverride={override}
            size={32}
            aria-label="Carregando lista de Quiz"
            data-testid="loader"
          />
        </div>
      )}
    </main>
  )
}
