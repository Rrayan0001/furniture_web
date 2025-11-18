import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutContent from '@/components/CheckoutContent';

export default function Checkout() {
  return (
    <>
      <Head>
        <title>Checkout - granger vintage</title>
        <meta name="description" content="Complete your purchase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <CheckoutContent />
        <Footer />
      </main>
    </>
  );
}
