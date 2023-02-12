import {
  FiShare2,
  FiPlay,
  FiArrowLeft,
  FiRotateCcw,
  FiHome,
  FiArrowRight
} from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './Quiz.module.scss'
import '../../app/globals.scss'
import Header from '@/components/Header';
import Link from "next/link";
import Toast from "@/components/Toast";

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
  const [status, setStatus] = useState('initial')
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
    setStatus('started');
    const quiz = document.getElementById('quiz');
    window.scroll(0, quiz?.offsetTop || 0)
    setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
  }

  const onOptionChange = (id: number) => {
    setOption(id)
  }

  useEffect(() => {
    if (lastQuestionId === currentQuestion) {
      setCurrentQuestion(999)
    } else {
      setCurrentQuestion(quizInfo.attributes.questions.data[indexQuestion].id)
    }
    
  }, [indexQuestion])

  const advanceQuestion = () => {
    if (option !== 0) {

      if (lastQuestionId === currentQuestion) {
        setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
        setOption(0)
        setStatus('finished')
        setCurrentQuestion(999)
        saveInteraction()
      } else {
        setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
        setOption(0)
        setIndexQuestion(indexQuestion + 1)
      }
      document.getElementById('scroll')?.scroll(indexQuestion * 10, 0)
    }
  }

  const remakeQuiz = () => {
    setStatus('initial')
    setCurrentQuestion(0)
    setIndexQuestion(0)
    setAnswhers([])
    setOption(0)
  }

  const copyToClipBoard = () => {
    console.log('router', router)
    if (typeof (navigator.clipboard) == 'undefined') {
      var text = document.createElement('textarea')
      text.value = `${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`
      text.style.position = 'fixed'
      document.body.appendChild(text)
      text.focus();
      text.select();

      document.execCommand('copy');
      document.body.removeChild(text);
      toast('Copiado para área de transferência', {
        position: 'bottom-center',
        className: `${styles.toast} progress`,
        
      })
    } else {
      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`).then(() => {
        // Invocar toast
        <Toast message="Copiado para área de transferência" type="success"/>
      }, () => {
        alert('Erro ao copiar url')
      })
    }

  }

  function Quizz(question: QuizQuestion, active: boolean) {
    return (
      <div key={question.id} className={active ? styles.activeQuestion : styles.disableQuestion}>
        <Image
          className={`${styles.image} `}
          layout='fill'
          objectFit='cover'
          alt={question.attributes.cover.data.attributes.alternativeText || 'Sem texto alternativo ):'}
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
          <FiArrowRight size={24} color="#FFF" />
        </button>
      </div>
    )
  }

  type Cover = {
    data: {
      attributes: {
        alternativeText: string
        url: string
      }
    }
  }
  function FinishedQuiz(cover: Cover, message: string, quizUrl: string) {
    return (
      <>
        <Image
          className={styles.image}
          layout='fill'
          objectFit='cover'
          alt={cover.data.attributes.alternativeText}
          src={cover.data.attributes.url}
        />
        <div>
          <h2 className={`${styles.title} ${styles.auxMTSm}`}>Quiz Finalizado!</h2>
          <span className={styles.feedbackMessage}>
            {message}
          </span>

          <div className={`${styles.buttonBox} ${styles.auxMXSm}`}>
            <button type="button" className={styles.button} onClick={remakeQuiz}>
              Refazer
              <FiRotateCcw size={24} />
            </button>

            <button type="button" className={styles.button} onClick={copyToClipBoard}>
              Compartilhar
              <FiShare2 size={24} />
            </button>
          </div>

          <Link href="/"  className={styles.link}>
            <span style={{ fontSize: '1.6rem', fontFamily: 'Open sans'}}>Ir para página Inicial</span>
            <FiHome size={24} style={{ marginLeft: '.8rem'}}/>
          </Link>

          <ToastContainer autoClose={1500} className={styles.toastContainer} progressStyle={{ backgroundColor: 'red', color: 'red'}} />
        </div>
      </>
    )
  }
  function getTotalCorrectQuestions() {
    let totalCorrectAnshwers = 0
    answhers.forEach(anshwer => {
      const question = questions.data.find(question => question.id === anshwer.question)
      if (question?.attributes.correctAnswer.data.id === anshwer.anshwer) {
        totalCorrectAnshwers += 1;
      }
    })

    return totalCorrectAnshwers
  }
  function getFeedbackQuiz() {
    let totalCorrectAnshwers = getTotalCorrectQuestions()
    let percentageAccurance = 0

    if (totalCorrectAnshwers !== 0) {
      percentageAccurance = (totalCorrectAnshwers * 100) / questions.data.length
    }

    if (percentageAccurance >= 70) {
      return quizInfo.attributes.fullKnowledge.replace('${X}', String(totalCorrectAnshwers))
    }
    if (percentageAccurance >= 30) {
      return quizInfo.attributes.mediumKnowledge.replace('${X}', String(totalCorrectAnshwers))
    }
    return quizInfo.attributes.littleKnowledge.replace('${X}', String(totalCorrectAnshwers))
  }

  function saveInteraction() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { data: {quiz: quizInfo.id, correctQuestions: getTotalCorrectQuestions(), totalQuestions: questions.data.length }}
      )
    })
  }
  return (
    <>
      <Header />
      <div className={styles.quiz} id="quiz">

        <h1 className={styles.title}>{quizInfo.attributes.title}</h1>

        {status === 'initial' ? (
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
              <button type='button' className={styles.button} onClick={() => router.back()}>Voltar <FiArrowLeft size={24} /></button>
              <button type='button' className={styles.button} onClick={InitializeQuiz}>Iniciar <FiPlay size={24} /></button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.markerQuestionBox} id="scroll">
              {questions.data.map((question, index) => {
                const anshwer = answhers.find(answher => answher.question === question.id);
                return (
                  <div key={question.id} id={String(question.id)}
                    className={
                      `${styles.markerQuestion} 
                    ${styles[choiceQuestionMarkerColor(anshwer?.question || 0, anshwer?.anshwer || 0)]}
                    ${currentQuestion === question.id && styles.Selected}
                    `}>
                    {index + 1}
                  </div>
                )
              })}
            </div>

            {status === 'started' ? (
              quizInfo.attributes.questions.data.map(question => (
                Quizz(question, currentQuestion === question.id)
              ))
            ) : (
              FinishedQuiz(quizInfo.attributes.cover, getFeedbackQuiz(), `localhost:3000/quiz/5`)
            )}
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

  return {
    props: {
      quizInfo
    }
  }
}