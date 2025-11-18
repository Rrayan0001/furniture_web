'use client';
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    } else {
      alert('Please enter your email address');
    }
  };

  return (
    <footer className="w-full bg-[#FAF9F6] border-t-2 border-black py-12 md:py-20">
      <div className="w-full px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Left Column - Brand */}
          <div className="flex flex-col">
            <h3 className="text-[20px] md:text-[27px] font-bold text-black mb-6 md:mb-12">granger vintage</h3>
            <p className="text-[14px] md:text-[18px] text-black">Made with Squarespace</p>
          </div>

          {/* Middle Column - Links */}
          <div className="flex flex-col gap-4 md:gap-6">
            <a href="/about" className="text-[16px] md:text-[21px] font-bold text-black underline hover:opacity-70">
              About
            </a>
            <a href="/contact" className="text-[16px] md:text-[21px] font-bold text-black underline hover:opacity-70">
              Contact
            </a>
            <a href="#" className="text-[16px] md:text-[21px] font-bold text-black underline hover:opacity-70">
              FAQs
            </a>
            <a href="#" className="text-[16px] md:text-[21px] font-bold text-black underline hover:opacity-70">
              Shipping & Returns
            </a>
          </div>

          {/* Right Column - Newsletter */}
          <div className="flex flex-col border-t-2 border-black pt-6 md:pt-8">
            <h3 className="text-[24px] md:text-[32px] font-bold text-black mb-6 md:mb-12">Get our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 md:px-6 py-4 md:py-6 border border-gray-300 bg-white text-black text-[14px] md:text-[18px] focus:outline-none focus:border-black"
              />
              <button 
                type="submit"
                className="px-8 md:px-16 py-4 md:py-6 border-2 border-black bg-white text-black text-[14px] md:text-[18px] font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
