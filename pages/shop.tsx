import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'

export default function Shop() {
  return (
    <>
      <Head>
        <title>Shop - granger vintage</title>
        <meta name="description" content="Shop our collection of midcentury modern, vintage, and retro home decor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <ShopContent />
        <Footer />
      </main>
    </>
  )
}
