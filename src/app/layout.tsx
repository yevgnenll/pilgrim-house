import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B&W Mission Center',
  description: '캄보디아 시한욱빌 김순아 선교사 — 선교 소식, 기도제목, 사진을 나눕니다.',
  openGraph: {
    title: 'B&W Mission Center',
    description: '캄보디아 시한욱빌 선교 사역',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7W0LWQV2G5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7W0LWQV2G5');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-stone-50 text-stone-800 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
