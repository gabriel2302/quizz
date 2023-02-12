import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastProps = {
  message: string;
  type: string
}
export default function Toast({message, type}: ToastProps){
  const notify = () => toast(message);
  console.log('entrou aqui')
  return (
    <div>
      <ToastContainer autoClose={4000} />
    </div>
  );
}