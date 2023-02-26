import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { useRef } from 'react';
import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import styles from './contact.module.scss';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { toast, ToastContainer } from 'react-toastify';

interface FormData {
  email: string;
  name: string;
  message: string;
  telephone?: string;
}

export default function Contact() {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit: SubmitHandler<FormData> = async data => {
    const postData = async () => {
      try {
        if (formRef.current) {
          formRef.current.setErrors({});
        }
        const schema = Yup.object().shape({
          email: Yup.string().email('Digite um E-mail válido').required('Campo E-mail é obrigatório'),
          name: Yup.string().required('Digite seu nome'),
          message: Yup.string().required('Digite sua mensagem').min(20, 'Digite no mínimo 20 caracteres'),
          telephone: Yup.string()
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { data: { name: data.name, email: data.email, message: data.message, telephone: data.telephone } }
          )
        })
        formRef.current?.reset();
        toast.success('Mensagem enviada com sucesso', {
          position: 'top-center',
          className: `${styles.toast} progress`,
        })
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
          toast.error('Corriga os erros para enviar a mensagem', {
            position: 'top-center',
            className: `${styles.toast} progress`,
          })
        } else {
          toast.error('Ocorreu um erro ao enviar a mensagem', {
            position: 'top-center',
            className: `${styles.toast} progress`,
          })
        }
      }
    }
    await postData()
  }
  return (
    <div className={styles.contactBox}>
      <Form ref={formRef} onSubmit={handleSubmit} className={styles.formBox}>
        <Input name="name" label="Nome *" />
        <Input name="email" label="E-mail *" />
        <Input name="telephone" label="Telefone" type={"tel"} />
        <TextArea name="message" label="Mensagem *" rows={5} />
        <button type='submit' className={styles.button}>Enviar Mensagem</button>
      </Form>

      <ToastContainer autoClose={1500} className={styles.toastContainer}  hideProgressBar />
    </div>
  )
}