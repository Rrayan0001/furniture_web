import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AboutContent from '@/components/AboutContent'

export default function About() {
  return (
    <>
      <Head>
        <title>About - granger vintage</title>
        <meta name="description" content="Learn about granger vintage - Established in 2018 in Austin, Texas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-black">
        <Header theme="dark" />
        <AboutContent />
        <Footer />
      </main>
    </>
  )
}
