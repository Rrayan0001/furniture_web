import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactContent from '@/components/ContactContent'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - granger vintage</title>
        <meta name="description" content="Get in touch with granger vintage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <ContactContent />
        <Footer />
      </main>
    </>
  )
}
