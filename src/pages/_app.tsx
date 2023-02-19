import Header from '@/components/Header';
import type { AppProps } from 'next/app';
import './globals.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>)
}