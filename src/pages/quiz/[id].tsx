import 'react-toastify/dist/ReactToastify.css';
import {
  FiShare2,
  FiPlay,
  FiArrowLeft,
  FiRotateCcw,
  FiHome,
  FiArrowRight
} from "react-icons/fi";
import { getPlaiceholder } from "plaiceholder";
import { ToastContainer, toast } from 'react-toastify';


import { useRouter } from 'next/router';

import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './Quiz.module.scss'
import Header from '@/components/Header';
import Link from "next/link";
import { useLocalStorage } from 'usehooks-ts'
import Button from '@/components/Button';

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
            base64: string
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
                    url: string;
                    base64: string;
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
        attributes: { alternativeText: string; url: string; base64: string }
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

type AnshweredQuiz = {
  data: {
    quiz: number;
    correctQuestions: number;
    totalQuestions: number;
    thumbnail: string;
    description: string;
    alternativeText: string;
  }
}

export default function QuizPage({ quizInfo }: QuizPageProps) {
  const [quizAnswered, setQuizAnshwered] = useLocalStorage<AnshweredQuiz[]>('quizAnswered', []);
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

  useEffect(() => {
    if (lastQuestionId === currentQuestion) {
      setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
    }
  }, [answhers])

  useEffect(() => {
    if (status === 'finished') {
      saveInteraction()
    }
  }, [status])
  const advanceQuestion = () => {
    if (option !== 0) {

      if (lastQuestionId === currentQuestion) {
        setAnswhers([...answhers, { question: currentQuestion, anshwer: option }])
        setOption(0)
        setStatus('finished')
        setCurrentQuestion(999)
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
        toast('Copiado para área de transferência', {
          position: 'bottom-center',
          className: `${styles.toast} progress`,
        })
      }, () => {
        alert('Erro ao copiar url')
      })
    }

  }

  function Quizz(question: QuizQuestion, active: boolean) {
    return (
      <div key={question.id} className={`${active ? styles.activeQuestion : styles.disableQuestion} ${styles.quizBox}`}>
        <Image
          className={`${styles.image} `}
          fill
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={question.attributes.cover.data.attributes.base64}
          alt={question.attributes.cover.data.attributes.alternativeText || 'Sem texto alternativo ):'}
          src={question.attributes.cover.data.attributes.url}
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
        />
        <h2 className={styles.description}>{question.attributes.description}</h2>
        {question.attributes.answers.data.map(answher => (
          <div key={answher.id} className={styles.answher} onClick={() => onOptionChange(answher.id)}>
            <input type="radio" value={answher.id} name='anshwer' id={String(answher.id)} checked={answher.id === option} onChange={(e) => onOptionChange(Number(e.target.value))} />
            <label htmlFor="anshwer">{answher.attributes.description}</label>
          </div>
        ))}
        <div className={styles.right}>
          <Button style={{ margin: 0 }} icon="FiArrowRight" type="button" onClick={advanceQuestion}></Button>
        </div>
      </div>
    )
  }

  type Cover = {
    data: {
      attributes: {
        alternativeText: string
        url: string;
        base64: string
      }
    }
  }
  function FinishedQuiz(cover: Cover, message: string, quizUrl: string) {
    return (
      <>
        <Image
          className={styles.image}
          fill
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={cover.data.attributes.base64}
          alt={cover.data.attributes.alternativeText}
          src={cover.data.attributes.url}
        />
        <div>
          <h2 className={`${styles.title} ${styles.auxMTSm}`}>Quiz Finalizado!</h2>
          <span className={styles.feedbackMessage}>
            {message}
          </span>

          <div className={`${styles.buttonBox} ${styles.auxMXSm}`}>
            <Button type="button" icon="FiRotateCcw" onClick={remakeQuiz}>
              Refazer
            </Button>

            <Button type="button" icon="FiShare2" onClick={copyToClipBoard}>
              Compartilhar
            </Button>
          </div>

          <Link href="/" className={styles.link}>
            <span style={{ fontSize: '1.6rem', fontFamily: 'Open sans' }}>Ir para página Inicial</span>
            <FiHome size={24} style={{ marginLeft: '.8rem' }} />
          </Link>

          <ToastContainer autoClose={1500} className={styles.toastContainer} progressStyle={{ backgroundColor: '#49e673', color: '#49e673' }} />
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
        { data: { quiz: quizInfo.id, correctQuestions: getTotalCorrectQuestions(), totalQuestions: questions.data.length } }
      )
    })
    const thumbnail = quizInfo.attributes.cover.data.attributes.url;
    const alternativeText = quizInfo.attributes.cover.data.attributes.alternativeText;
    const description = quizInfo.attributes.description;
    setQuizAnshwered((prevValue) => [...prevValue, { data: { quiz: quizInfo.id, correctQuestions: getTotalCorrectQuestions(), totalQuestions: questions.data.length, description, thumbnail, alternativeText } }])
  }
  return (
    <>
      <Header />
      <div className={`main-content`} id="quiz">

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
            <div className={styles.quizBox}>
              <Image
                className={styles.image}
                fill
                priority
                style={{ objectFit: 'cover' }}
                alt={quizInfo.attributes.cover.data.attributes.alternativeText}
                src={quizInfo.attributes.cover.data.attributes.url}
                sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
              />
            </div>
            <h2>{quizInfo.attributes.description}</h2>
            <div className={styles.buttonBox}>
              <Button type='button' onClick={() => router.back()} icon="FiArrowLeft" >Voltar</Button>
              <Button type='button' onClick={InitializeQuiz} icon="FiPlay">Iniciar</Button>
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
  if (response.status === 404) {
    return null;
  }
  const data = await response.json()
  return data.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;

  if (!id) {
    return {
      props: { hasError: true }
    }
  }

  const quizInfo = await getQuiz(id[0])
  if (!quizInfo) {
    return {
      redirect: {
        destination: `/404?quiz=${id[0]}`,
        permanent: true
      }
    }
  }
  await Promise.all(quizInfo.attributes.questions.data.map(async (data: any, index: any) => {
    const { base64, img } = await getPlaiceholder(data.attributes.cover.data.attributes.url)
    data.attributes.cover.data.attributes.base64 = base64
    return {
      ...img,
      base64: base64
    }
  }))

  const { base64 } = await getPlaiceholder(quizInfo.attributes.cover.data.attributes.url)
  quizInfo.attributes.cover.data.attributes.base64 = base64

  return {
    props: {
      quizInfo
    }
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}