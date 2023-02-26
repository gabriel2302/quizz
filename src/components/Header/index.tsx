import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react'
import { BurguerMenu } from '../BurguerMenu'
import styles from './header.module.scss'
import {
  FiCrosshair,
  FiGrid,
  FiStar,
  FiPhoneForwarded,
  FiMenu,
  FiHome
} from 'react-icons/fi';
import Link from 'next/link';
import Input from '../Input';
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';

import {useSearchContext} from '../../hooks/contexts/searchContext';

interface FormData {
  search: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState("inicio");
  const formRef = useRef<FormHandles>(null);
  const { push } = useRouter();
  const {setQuizList, setSearchTerm} = useSearchContext();


  const handleSubmit: SubmitHandler<FormData> = async data => {
    const postData = async () => {
      try {
        if (formRef.current) {
          formRef.current.setErrors({});
        }
        const schema = Yup.object().shape({
          search: Yup.string().required('Preencha o campo para realizar uma busca'),
        })

        await schema.validate(data, {
          abortEarly: false
        })
        const terms = data.search.split(' ')
        let filters = '';
        terms.forEach((item, index) => {
          filters += `filters[$or][${index}][title][$containsi]=${item}&`
        })
        filters = filters.substring(0, filters.length -1);
        const quizListResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?${filters}&populate[0]=cover`)
        const quizList = await quizListResponse.json();
        formRef.current?.reset(); 
        if (quizList.data.length === 0) {
          push(`/404?search=${data.search}`)
        } else {
          setSearchTerm(data.search)
          setQuizList(quizList.data)
          push('/search')
        }
      } catch (err) {
        let validationErrors = {};
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((error)=> {
            if (error.path) {
              (validationErrors as any )[error.path] = error.message;
            }
          });

          if (formRef.current) {
            formRef.current.setErrors(validationErrors);
          }
        }
      }
    }
    await postData()
  }

  function navigateMenu(item: string) {
    setIsOpen(false)
    setIsSelected(item);
  }

  return (
    <header className={styles.header}>
      <div>
        <button type='button' className={styles.burguerIcon} onClick={() => setIsOpen(!isOpen)}>
          <FiMenu size={32} />
        </button>
        <BurguerMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ul className={styles.burguerMenu} id="menuList">
            <Link href="/" onClick={() => navigateMenu("inicio")}>
              <li id="inicio" className={`${isSelected === "inicio" && styles.selectedItem}`}>
                <FiHome size={24} />
                <span>Inicio</span>
              </li>
            </Link>
            <Link href="/categories" onClick={() => navigateMenu("categorias")}>
              <li id="categorias" className={`${isSelected === "categorias" && styles.selectedItem}`}>
                <FiGrid size={24} />
                <span>Categorias</span>
              </li>
            </Link>
            <Link href="/answered" onClick={() => navigateMenu("respondidos")}>
              <li id="respondidos" className={`${isSelected === "respondidos" && styles.selectedItem}`}>
                <FiCrosshair size={24} />
                <span>Já respondidos</span>
              </li>
            </Link>
            <Link href="/highlight" onClick={() => navigateMenu("alta")}>
              <li id="alta" className={`${isSelected === "alta" && styles.selectedItem}`}>
                <FiStar size={24} />
                <span>Quiz Em Alta</span>
              </li>
            </Link>
            <Link href="/contact" onClick={() => navigateMenu("contato")}>
              <li id="contato" className={`${isSelected === "contato" && styles.selectedItem}`}>
                <FiPhoneForwarded size={24} />
                <span>Contato</span>
              </li>
            </Link>
          </ul>
        </BurguerMenu>
      </div>
      <div className={styles.logoBox}>
        <span>
          Quizz
        </span>
      </div>
      <Form className={styles.inputBox} ref={formRef} onSubmit={handleSubmit}>
        <Input name='search' placeholder="Pesquisar" type="search" className={styles.searchInput} />
      </Form>
    </header>
  )
}