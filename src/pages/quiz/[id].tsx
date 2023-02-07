import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'

import styles from './Quiz.module.scss'

type QuizPageProps = {
  quizInfo: {
    id: number;
    attributes: {
      title: string;
      description: string;
      littleKnowledge: string;
      mediumKnowledge: string;
      fullKnowledge: string;
      cover: {
        data: {
          id: number;
          attributes: {
            alternativeText: string;
            url: string;
          }
        }
      },
      questions: {
        data: [
          {
            id: number;
            attributes: {
              description: string;
              cover: {
                data: {
                  id: number;
                  attributes: {
                    alternativeText: string;
                    url: string
                  }
                }
              },
              answers: {
                data: [
                  {
                    id: number;
                    attributes: {
                      description: string;
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }
}

export default function QuizPage({ quizInfo }: QuizPageProps) {
  console.log(quizInfo.attributes.questions.data[0].attributes)
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answhers, setAnswhers] = useState([]);
  const [option, setOption] = useState(0)

  function InitializeQuiz() {
    setQuizStarted(true);
    setCurrentQuestion(quizInfo.attributes.questions.data[0].id)
  }


  const onOptionChange = (id: number) => {
    setOption(id)
  }
  
  // Todo = Barra com numero de questões e cor verde para acerto e vermelho para erro
  // Passar para frente
  // Navegar entre as opções

  return (
    <div>
      <h1>{quizInfo.attributes.title}</h1>
      {!quizStarted ? (
        <div>
          <div>
            <Image
              className={styles.image}
              layout='fill'
              objectFit='cover'
              alt={quizInfo.attributes.cover.data.attributes.alternativeText}
              src={quizInfo.attributes.cover.data.attributes.url}
            />
          </div>
          <h2>{quizInfo.attributes.description}</h2>
          <button type='button' onClick={InitializeQuiz}>Iniciar Quiz</button>
        </div>
      ) : (
        quizInfo.attributes.questions.data.map(question => (
          <div key={question.id} className={question.id === currentQuestion ? styles.activeQuestion : styles.disableQuestion}>
            <Image
              className={`${styles.image} `}
              layout='fill'
              objectFit='cover'
              alt={question.attributes.cover.data.attributes.alternativeText}
              src={question.attributes.cover.data.attributes.url}
            />
            <h2>{question.attributes.description}</h2>
            {question.attributes.answers.data.map(answher => (
              <div key={answher.id} className={styles.answher} onClick={() => onOptionChange(answher.id)}>
                <input type="radio" value={answher.id} name='anshwer' id={String(answher.id)} checked={answher.id === option} />
                <label htmlFor="anshwer">{answher.attributes.description}</label>
              </div>
            ))}
          </div>
        ))
      )}

    </div>
  )
}

const getQuiz = async (quizId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}?populate[0]=cover&populate[1]=questions&populate[2]=questions.cover&populate[3]=questions.answers`)
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