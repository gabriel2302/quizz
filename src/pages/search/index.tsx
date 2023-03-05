import { useSearchContext } from "@/hooks/contexts/searchContext";
import QuizList from '../../components/Quiz/QuizList'
import style from './search.module.scss';

export default function Search() {
  const {quizList, searchTerm} = useSearchContext();

  return (
    <div className={`${style.searchBox} main-content`}>
      <h1 className={style.title}>Termo buscado: &ldquo;{searchTerm}&rdquo;</h1>
      <span>Resultados encontrados: {quizList.length}</span>

      <QuizList {...quizList} />
    </div>
  )
}