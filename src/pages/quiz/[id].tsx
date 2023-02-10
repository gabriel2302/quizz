import { BsArrowRight, BsFillPlayFill, BsFillReplyFill } from "react-icons/bs";
import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './Quiz.module.scss'
import '../../app/globals.scss'
import Header from '@/components/Header';

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
              correctAnswer: {
                data: {
                  id: number;
                }
              }
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
      },
      tags: {
        data: [
          {
            id: number,
            attributes: { description: string }
          }
        ]
      }
    }
  }
}

type Question = {
  question: number;
  anshwer: number;
}

type QuizQuestion = {
  id: number;
  attributes: {
    cover: {
      data: {
        attributes: { alternativeText: string; url: string }
      }
    }
    description: string
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

export default function QuizPage({ quizInfo }: QuizPageProps) {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [indexQuestion, setIndexQuestion] = useState(0)
  const questions = quizInfo.attributes.questions
  const lastQuestionId = questions.data[questions.data.length - 1].id;
  const [answhers, setAnswhers] = useState<Question[]>([])
  const [option, setOption] = useState(0);


  const router = useRouter()

  function choiceQuestionMarkerColor(questionId: number, answherId: number) {
    const question = questions.data.find(question => question.id === questionId)
    if (!question) {
      return 'Neutral'
    }
    if (question.attributes.correctAnswer.data.id === answherId) {
      return 'Correct'
    } else if (question.attributes.correctAnswer.data.id !== answherId) {
      return 'Incorrect'
    }
    return 'Neutral'

  }

  function InitializeQuiz() {
    setQuizStarted(true);
    setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
  }

  const onOptionChange = (id: number) => {
    setOption(id)
  }

  useEffect(() => {
    setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
  }, [indexQuestion])

  const advanceQuestion = () => {
    console.log(option)
    if (option !== 0) {

      if (lastQuestionId === currentQuestion) {
        setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
      } else {
        setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
        setIndexQuestion(indexQuestion + 1)
      }
    }
  }

  // Todo = Barra com numero de questões e cor verde para acerto e vermelho para erro
  // Passar para frente
  // Navegar entre as opções
  function Quizz(question: QuizQuestion, active: boolean) {
    return (
      <div key={question.id} className={active ? styles.activeQuestion : styles.disableQuestion}>
        <Image
          className={`${styles.image} `}
          layout='fill'
          objectFit='cover'
          alt={question.attributes.cover.data.attributes.alternativeText}
          src={question.attributes.cover.data.attributes.url}
        />
        <h2 className={styles.description}>{question.attributes.description}</h2>
        {question.attributes.answers.data.map(answher => (
          <div key={answher.id} className={styles.answher} onClick={() => onOptionChange(answher.id)}>
            <input type="radio" value={answher.id} name='anshwer' id={String(answher.id)} checked={answher.id === option} onChange={(e) => onOptionChange(Number(e.target.value))} />
            <label htmlFor="anshwer">{answher.attributes.description}</label>
          </div>
        ))}

        <button style={{ margin: 0 }} className={`${styles.button} ${styles.buttonOnlyIcon} ${styles.right}`} type="button" onClick={advanceQuestion}>
          <BsArrowRight size={24} color="#FFF" />
        </button>
      </div>
    )
  }
  return (
    <>
      <Header />
      <div className={styles.quiz}>

        <h1 className={styles.title}>{quizInfo.attributes.title}</h1>

        {!quizStarted ? (
          <div>
            <div className={styles.tags}>
              {quizInfo.attributes.tags.data.map(tag => {
                return (
                  <span key={tag.id} className={styles.tag}>{tag.attributes.description}</span>
                )
              })}
            </div>
            <Image
              className={styles.image}
              layout='fill'
              objectFit='cover'
              alt={quizInfo.attributes.cover.data.attributes.alternativeText}
              src={quizInfo.attributes.cover.data.attributes.url}
            />
            <h2>{quizInfo.attributes.description}</h2>
            <div className={styles.buttonBox}>
              <button type='button' className={styles.button} onClick={() => router.back()}>Voltar <BsFillReplyFill size={24} /></button>
              <button type='button' className={styles.button} onClick={InitializeQuiz}>Iniciar <BsFillPlayFill size={24} /></button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.markerQuestionBox}>
              {questions.data.map((question, index) => {
                const anshwer = answhers.find(answher => answher.question === question.id)
                return (
                  <div className={`${styles.markerQuestion} ${styles.markerQuestion + '__' + choiceQuestionMarkerColor(anshwer?.question || 0, anshwer?.anshwer || 0)}`}>
                    {index + 1}
                  </div>
                )
              })}</div>
            {quizInfo.attributes.questions.data.map(question => (
              Quizz(question, currentQuestion === question.id)
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const getQuiz = async (quizId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}?populate[0]=cover&populate[1]=questions&populate[2]=questions.cover&populate[3]=questions.answers&populate[4]=questions.correctAnswer&populate[5]=tags`)
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