
import { useEffect, useState } from 'react';
import QuizList from '../../components/Quiz/QuizList'
import styles from './categories.module.scss';

type Tag = {
  id: number;
  attributes: {
    description: string;
  }
}

export default function Categories() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [quizList, setQuizList] = useState([]);

  function getQuizListByTagId(tagId: number) {
    getQuizList(tagId).then(response => {
      setQuizList(response)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const tagList = await getTags()
      setTags(tagList)
    }
    fetchData()
  }, []);

  console.log(quizList)
  return (
    <>
    <div className={styles.categories}>
      <h1 className={styles.title}>Lista de categorias</h1>
      <span className={styles.description}>Clique em uma categoria para listar os quiz</span>
      <div className={styles.tagBox}>
        {tags.map(tag => (
          <button key={tag.id} className={styles.tagButton}onClick={() => getQuizListByTagId(tag.id)}>
            <span>{tag.attributes.description}</span>
          </button>
        ))}
      </div>
      <div className={styles.quizListBox}>
        {quizList.length === 0 && (
          <span>Clique em um botão para buscar os quiz do tema</span>
        )}

        {quizList.length > 0 && (
          <div className={styles.quizListBox}>
            <QuizList {...quizList} />
          </div>
        )}
      </div>
    </div>
    </>
  )
}

const getQuizList = async (tagId: Number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?[filters][tags][id][$eq]=${tagId}&populate[0]=cover&populate[1]=cover&populate[2]=tags`, { cache: 'force-cache' })
  const quizList = await response.json();

  return quizList.data;
}

const getTags = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, { cache: 'force-cache' })
  const tags = await response.json()
  return tags.data;
}

