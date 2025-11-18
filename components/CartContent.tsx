'use client';
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

const CartContent: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const getCartTotal = () => {
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
    return `$${total.toFixed(2)}`;
  };

  return (
    <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h1 className="text-[28px] md:text-[48px] font-bold text-black mb-8 md:mb-12">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <p className="text-[16px] md:text-[18px] text-black mb-6">Your cart is empty</p>
            <a
              href="/shop"
              className="inline-block px-8 py-3 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Cart Items */}
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 md:gap-6 pb-6 border-b border-gray-300"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Name */}
                  <div className="flex-1">
                    <h3 className="text-[14px] md:text-[16px] font-medium text-black">
                      {item.name}
                    </h3>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 md:px-3 py-1 md:py-2 text-black hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3 md:px-4 py-1 md:py-2 border-x border-black text-black text-[14px] md:text-[16px]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 md:px-3 py-1 md:py-2 text-black hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="w-16 md:w-20 text-right">
                    <p className="text-[14px] md:text-[16px] text-black font-medium">
                      {item.price}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-black hover:opacity-70 text-[20px] md:text-[24px] px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="flex flex-col items-end gap-6 mt-8">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                <span className="text-[16px] md:text-[20px] text-black">Subtotal</span>
                <span className="text-[18px] md:text-[24px] font-bold text-black">
                  {getCartTotal()}
                </span>
              </div>

              <a href="/checkout" className="block w-full md:w-auto">
                <button
                  className="w-full md:w-[300px] px-8 md:px-12 py-3 md:py-4 border-2 border-black bg-white text-black text-[14px] md:text-[16px] font-bold hover:bg-black hover:text-white transition-colors"
                >
                  Checkout
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartContent;
