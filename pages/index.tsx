import Head from 'next/head'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import NewArrivals from '@/components/NewArrivals'
import CirclesCollection from '@/components/CirclesCollection'
import FoundFlorals from '@/components/FoundFlorals'
import Categories from '@/components/Categories'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>granger vintage - Midcentury Modern, Vintage, & Retro Home Decor</title>
        <meta name="description" content="Midcentury Modern, Vintage, & Retro Home Decor based out of Austin, TX" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <Hero />
        <NewArrivals />
        <CirclesCollection />
        <FoundFlorals />
        <Categories />
        <Footer />
      </main>
    </>
  )
}
