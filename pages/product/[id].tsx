'use client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

// Product data
const products: Record<string, {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
}> = {
  'grandmas-vases': {
    id: 'grandmas-vases',
    name: "Grandma's Vases (set of 4)",
    price: '$60.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80'
  },
  'azul-candles': {
    id: 'azul-candles',
    name: 'Azul Candles (set of 2)',
    price: '$40.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80'
  },
  'rome-candle': {
    id: 'rome-candle',
    name: 'Rome Candle',
    price: '$40.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=800&q=80'
  },
  'orb-light': {
    id: 'orb-light',
    name: 'Orb Light',
    price: '$80.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&q=80'
  },
  'circular-candle': {
    id: 'circular-candle',
    name: 'Circular Candle',
    price: '$15.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80'
  },
  'crystal-ball-sculpture': {
    id: 'crystal-ball-sculpture',
    name: 'Crystal Ball Sculpture',
    price: '$100.00',
    description: 'This is a piece of decor. Made to transform any space, this piece reflects both our design roots and latest inspirations.',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80'
  }
};

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);

  const product = id ? products[id as string] : null;

  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found - granger vintage</title>
        </Head>
        <main className="min-h-screen bg-[#FAF9F6]">
          <Header />
          <div className="pt-[100px] pb-20 px-8 text-center">
            <h1 className="text-[32px] font-bold text-black mb-4">Product Not Found</h1>
            <a href="/shop" className="text-black underline">Return to Shop</a>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      const existingItem = cart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Added ${quantity} x ${product.name} to cart!`);
      
      // Redirect to cart page
      setTimeout(() => {
        router.push('/cart');
      }, 500);
    }
  };

  return (
    <>
      <Head>
        <title>{product.name} - granger vintage</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        
        {/* Breadcrumb */}
        <div className="pt-[100px] px-4 md:px-8 max-w-[1400px] mx-auto">
          <p className="text-[12px] text-black mb-8">
            <a href="/shop" className="hover:opacity-70">Shop</a> &gt; {product.name}
          </p>
        </div>

        {/* Product Detail */}
        <section className="w-full bg-[#FAF9F6] pb-20">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Left - Product Image */}
              <div className="w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right - Product Info */}
              <div className="flex flex-col">
                <h1 className="text-[32px] md:text-[40px] font-bold text-black mb-4">
                  {product.name}
                </h1>
                <p className="text-[24px] md:text-[28px] text-black mb-6">
                  {product.price}
                </p>
                <p className="text-[14px] md:text-[16px] leading-relaxed text-black mb-8">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-[14px] text-black mb-2 block font-medium">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-black w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-black hover:bg-gray-100 text-[18px]"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center border-x border-black bg-transparent text-black text-[16px]"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-black hover:bg-gray-100 text-[18px]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto px-12 py-4 border-2 border-black bg-white text-black text-[16px] font-bold hover:bg-black hover:text-white transition-colors"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
