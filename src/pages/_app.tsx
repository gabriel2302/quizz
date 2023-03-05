import './globals.scss';
import Header from '@/components/Header';
import type { AppProps } from 'next/app';
import { SearchContextProvider } from '../hooks/contexts/searchContext'
import { Sidebar } from '@/components/Sidebar';
import { MenuProvider } from '@/hooks/contexts/menuContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SearchContextProvider>
      <MenuProvider>
        <Header />
        <Sidebar />
        <Component {...pageProps} />
      </MenuProvider>
    </SearchContextProvider>)
}