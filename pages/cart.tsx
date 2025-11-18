import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartContent from '@/components/CartContent';

export default function Cart() {
  return (
    <>
      <Head>
        <title>Shopping Cart - granger vintage</title>
        <meta name="description" content="Your shopping cart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <CartContent />
        <Footer />
      </main>
    </>
  );
}
