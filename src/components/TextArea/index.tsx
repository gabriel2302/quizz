import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import styles from './textarea.module.scss'

interface Props {
  name: string
  label?: string
}

type InputProps = JSX.IntrinsicElements['textarea'] & Props

export default function TextArea({ name, label, ...rest }: InputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

      <textarea
        id={fieldName}
        ref={inputRef}
        className={`${styles.input} ${error && styles.inputError}`}
        onFocus={clearError}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <span className={styles.error}>{error}</span>}
    </>
  )
}