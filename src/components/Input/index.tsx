import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import styles from './input.module.scss';

interface Props {
  name: string
  label?: string
}

type InputProps = JSX.IntrinsicElements['input'] & Props

export default function Input({ name, label, ...rest }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { fieldName, defaultValue, registerField, error, clearError } = useField(name)
  
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])
  
  return (
    <>
      {label && <label htmlFor={fieldName} className={styles.label}>{label.includes('*') ?  <span>{label.replace('*', '')} <span style={{color: '#AD0E0B'}}>*</span></span> : label}</label>}

      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        onFocus={clearError}
        className={`${styles.input} ${error && styles.inputError}`}
        {...rest}
      />

      {error && <span className={styles.error}>{error}</span>}
    </>
  )
}