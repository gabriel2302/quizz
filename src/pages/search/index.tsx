import { useSearchContext } from "@/hooks/contexts/searchContext";
import QuizList from '../../components/Quiz/QuizList'
import style from './search.module.scss';

export default function Search() {
  const {quizList, searchTerm} = useSearchContext();

  return (
    <div className={style.searchBox}>
      <h1>Termo buscado: "{searchTerm}"</h1>
      <span>Resultados encontrados: {quizList.length}</span>

      <QuizList {...quizList} />
    </div>
  )
}