import { GetServerSideProps } from 'next'
import Image from 'next/image'

import styles from './Quiz.module.scss'

type Cover = {
  data: {
    attributes: {
      alternativeText: string;
      url: string
    },
    id: number
  }
}

type Question = {
  attributes: {
    description: string
    cover: {
      data: {
        attributes: {
          alternativeText: string
          url: string
        }
      }
    }
  },
  id: number
}

type Tag = {
  id: number
  attributes: {
    description: string
  }
}

type QuizInfo = {
  id: number
  attributes: {
    cover: Cover
    description: string
    title: string
    fullKnowledge: string
    mediumKnowledge: string
    littleKnowledge: string
    questions: Question[]
    tags: Tag[]
  }
}

type QuizPageProps = {
  quizInfo: QuizInfo
}

export default function QuizPage({ quizInfo }: QuizPageProps) {
  console.log(quizInfo)
  return (
    <div>
      <h1>{quizInfo.attributes.title}</h1>

      <div>
      <Image
          className={styles.image} 
          layout='fill'
          objectFit='cover'
          alt={quizInfo.attributes.cover.data.attributes.alternativeText} 
          src={quizInfo.attributes.cover.data.attributes.url}
        />
      </div>

    </div>
  )
}

const getQuiz = async (quizId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}?populate[0]=cover&populate[1]=questions&populate[2]=questions.cover`)
  const data = await response.json()
  return data.data
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (!id) {
    return {
      props: { hasError: true }
    }
  }

  const quizInfo = await getQuiz(id[0])
  console.log('quizInfo', quizInfo)
  return {
    props: {
      quizInfo
    }
  }
}