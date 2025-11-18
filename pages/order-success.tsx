import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccess() {
  return (
    <>
      <Head>
        <title>Order Successful - granger vintage</title>
        <meta name="description" content="Your order has been placed successfully" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
          <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center">
            <div className="mb-8">
              <svg className="w-20 h-20 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-[32px] md:text-[48px] font-bold text-black mb-4">
              Thank You!
            </h1>
            <p className="text-[18px] md:text-[20px] text-black mb-8">
              Your order has been placed successfully.
            </p>
            <p className="text-[14px] md:text-[16px] text-gray-600 mb-12">
              You will receive an email confirmation shortly with your order details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/shop">
                <button className="px-8 py-3 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors">
                  Continue Shopping
                </button>
              </a>
              <a href="/">
                <button className="px-8 py-3 border-2 border-black bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                  Back to Home
                </button>
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
