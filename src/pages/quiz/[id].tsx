import { BsArrowRight } from "react-icons/bs";

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
  const lastQuestionId = questions.data[questions.data.length -1].id;
  const [answhers, setAnswhers] = useState<Question[]>([])
  const [option, setOption] = useState(0);

  function InitializeQuiz() {
    setQuizStarted(true);
    setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
  }

  const onOptionChange = (id: number) => {
    setOption(id)
  }

  useEffect(()=> {
    setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
  }, [indexQuestion])

  const advanceQuestion = () => {
    console.log(option)
    if (option !== 0) {
      setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
      setIndexQuestion(indexQuestion+1)
      console.log('index', indexQuestion, quizInfo.attributes.questions.data[indexQuestion].id)
      
      console.log(answhers, currentQuestion)
    }
  }

  // Todo = Barra com numero de questões e cor verde para acerto e vermelho para erro
  // Passar para frente
  // Navegar entre as opções
  function Quizz(question: QuizQuestion, currentQuestion: number) {
    //console.log(currentQuestion)
    return (
      <div key={question.id} className={question.id === currentQuestion ? styles.activeQuestion : styles.disableQuestion}>
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
        <button className="" type="button" onClick={advanceQuestion}>
          <BsArrowRight size={24} color="#3f4e6e" />
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
            <button type='button' onClick={InitializeQuiz}>Iniciar Quiz</button>
          </div>
        ) : (
          quizInfo.attributes.questions.data.map(question => (
            Quizz(question, currentQuestion)
          ))
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