import QuizList from '@/components/Quiz/QuizList';
import React, { useContext, useState } from 'react';


type QuizItem = {
  id: number;
  attributes: {
    title: string;
    description: string;
    cover: {
      data: {
        id: number;
        attributes: {
          altenativeText: string;
          url: string;
        }
      }
    }
  }
}

interface ISearchContextProps {
  quizList: QuizItem[];
  loading: boolean;
  setQuizList: (quizList: QuizItem[]) => void;
  setLoading: (loading: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchContext = React.createContext<ISearchContextProps>({
  quizList: [],
  loading: true,
  setQuizList: () => {},
  setLoading: () => {},
  setSearchTerm: () => '',
  searchTerm: ''
});

export const SearchContextProvider = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SearchContext.Provider
      value={{
        quizList: quizList,
        loading: isLoading,
        setQuizList: setQuizList,
        setLoading: setIsLoading,
        setSearchTerm: setSearchTerm,
        searchTerm: searchTerm
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);