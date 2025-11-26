'use client';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  theme?: 'light' | 'dark';
  topOffset?: string;
  isAdmin?: boolean;
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

const Header: React.FC<HeaderProps> = ({ theme = 'light', topOffset = '0px', isAdmin = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-[#FAF9F6]';
  const textColor = isDark ? 'text-white' : 'text-black';
  const borderColor = isDark ? 'border-white' : 'border-black';
  const iconColor = isDark ? 'text-white' : 'text-black';
  const cartBadgeBg = isDark ? 'bg-white' : 'bg-black';
  const cartBadgeText = isDark ? 'text-black' : 'text-white';

  // Admin link handler
  const getLinkHref = (path: string) => {
    return isAdmin ? '/admin/dashboard' : path;
  };

  return (
    <>
      <header
        className={`w-full h-[70px] ${bgColor} border-b-2 ${borderColor} fixed left-0 z-50 transition-all duration-200`}
        style={{ top: topOffset }}
      >
        <div className="w-full h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <a href={isAdmin ? '/admin/dashboard' : '/'} className={`font-bold ${textColor} text-lg hover:opacity-70 transition-opacity`}>
            granger vintage
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <a href={getLinkHref('/shop')} className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              Shop
            </a>
            <a href={getLinkHref('/about')} className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              About
            </a>
            <a href={getLinkHref('/contact')} className={`${textColor} font-bold hover:opacity-70 transition-opacity cursor-pointer`}>
              Contact
            </a>
          </nav>

          {/* Icons / Actions */}
          <div className={`flex items-center space-x-6 ${iconColor}`}>
            {!user ? (
              <div className="flex items-center gap-4">
                <a href="/login" className="text-sm font-bold hover:opacity-70 transition-opacity">Login</a>
                <a href="/signup" className="px-4 py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors">Sign Up</a>
              </div>
            ) : (
              <a href="/profile" className="cursor-pointer hover:opacity-70 transition-opacity" title="My Profile">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            )}

            <a href="/cart" className="cursor-pointer hover:opacity-70 transition-opacity relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
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
              href={getLinkHref('/shop')}
              className="font-bold hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </a>
            <a
              href={getLinkHref('/about')}
              className="font-bold hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href={getLinkHref('/contact')}
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
