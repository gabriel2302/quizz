import './globals.scss';
import Header from '@/components/Header';
import type { AppProps } from 'next/app';


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>)
}