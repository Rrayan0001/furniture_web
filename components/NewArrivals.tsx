'use client';
import React, { useState } from 'react';

const NewArrivals: React.FC = () => {
  const [quantity1, setQuantity1] = useState(1);
  const [quantity2, setQuantity2] = useState(1);

  const handleAddToCart = (productId: string, productName: string, quantity: number, price: string, image: string) => {
    // Trigger a custom event to notify the cart context
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      const existingItem = cart.find((item: any) => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: price,
          image: image,
          quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Added ${quantity} x ${productName} to cart!`);
    }
  };

  return (
    <section className="w-full bg-[#E8E8E8] py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section Title */}
        <h2 className="text-[20px] md:text-[24px] font-bold text-black mb-8 md:mb-12">— New Arrivals</h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product 1 */}
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <img
                src="https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80"
                alt="Azul Candles (set of 2)"
                className="w-full h-auto object-cover"
              />
            </div>
            <h3 className="text-[14px] text-black mb-1">Azul Candles (set of 2)</h3>
            <p className="text-[14px] text-black mb-4">$40.00</p>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-black w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity1(Math.max(1, quantity1 - 1))}
                  className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                >
                  −
                </button>
                <input 
                  type="text" 
                  value={quantity1} 
                  readOnly
                  className="w-12 text-center border-x border-black bg-transparent text-black"
                />
                <button 
                  onClick={() => setQuantity1(quantity1 + 1)}
                  className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleAddToCart('azul-candles', 'Azul Candles (set of 2)', quantity1, '$40.00', 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80')}
                className="flex-1 px-6 py-2 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors text-center"
              >
                Add to cart
              </button>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex flex-col">
            <div className="w-full mb-4 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80"
                alt="Grandma's Vases (set of 4)"
                className="w-full sm:w-1/2 h-auto object-cover"
              />
            </div>
            <h3 className="text-[14px] text-black mb-1">Grandma's Vases (set of 4)</h3>
            <p className="text-[14px] text-black mb-4">$60.00</p>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-black w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity2(Math.max(1, quantity2 - 1))}
                  className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                >
                  −
                </button>
                <input 
                  type="text" 
                  value={quantity2} 
                  readOnly
                  className="w-12 text-center border-x border-black bg-transparent text-black"
                />
                <button 
                  onClick={() => setQuantity2(quantity2 + 1)}
                  className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleAddToCart('grandmas-vases', "Grandma's Vases (set of 4)", quantity2, '$60.00', 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80')}
                className="flex-1 px-6 py-2 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors text-center"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
