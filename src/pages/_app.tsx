import './globals.scss';
import Header from '@/components/Header';
import type { AppProps } from 'next/app';
import {SearchContextProvider} from '../hooks/contexts/searchContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SearchContextProvider>
      <Header />
      <Component {...pageProps} />
    </SearchContextProvider>)
}