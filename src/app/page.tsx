"use client";

import styles from './page.module.css'
import { useEffect, useState } from 'react'

import Header from '../components/Header'
import QuizList from '../components/Quiz/QuizList'

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

export default function Home() {
  const [data, setData] = useState<Quizz[]>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?populate[0]=cover`)
      const data = await response.json()
      console.log(data.data)
      setData(data.data)
    }
    fetchData()
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      {data && (<QuizList {...data}/>)}
    </main>
  )
}
