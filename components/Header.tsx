'use client';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

const CartBadge: React.FC<{ bgColor: string; textColor: string }> = ({ bgColor, textColor }) => {
  const { getCartCount } = useCart();
  const count = getCartCount();
  
  return (
    <span className={`absolute -top-2 -right-2 ${bgColor} ${textColor} text-xs w-4 h-4 flex items-center justify-center rounded-full`}>
      {count}
    </span>
  );
};

const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-[#FAF9F6]';
  const textColor = isDark ? 'text-white' : 'text-black';
  const borderColor = isDark ? 'border-white' : 'border-black';
  const iconColor = isDark ? 'text-white' : 'text-black';
  const cartBadgeBg = isDark ? 'bg-white' : 'bg-black';
  const cartBadgeText = isDark ? 'text-black' : 'text-white';

  return (
    <>
      <header className={`w-full h-[70px] ${bgColor} border-b-2 ${borderColor} fixed top-0 left-0 z-50`}>
        <div className="w-full h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className={`font-bold ${textColor} text-lg hover:opacity-70 transition-opacity`}>
            granger vintage
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <a href="/shop" className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              Shop
            </a>
            <a href="/about" className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              About
            </a>
            <a href="/contact" className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              Contact
            </a>
          </nav>

          {/* Icons */}
          <div className={`flex items-center space-x-6 ${iconColor}`}>
            <a href="#" className="cursor-pointer hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="1.5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.5" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <a href="#" className="cursor-pointer hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="cursor-pointer hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="/cart" className="cursor-pointer hover:opacity-70 transition-opacity relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <CartBadge bgColor={cartBadgeBg} textColor={cartBadgeText} />
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${iconColor} p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed top-[70px] left-0 right-0 ${bgColor} border-b-2 ${borderColor} z-40`}>
          <nav className={`flex flex-col space-y-4 p-4 ${textColor}`}>
            <a 
              href="/shop" 
              className="font-bold hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </a>
            <a 
              href="/about" 
              className="font-bold hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="/contact" 
              className="font-bold hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
