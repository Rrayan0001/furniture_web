'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  
  // Delivery details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  useEffect(() => {
    // Load cart from localStorage
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);
      if (parsedCart.length === 0) {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  const getSubtotal = () => {
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
    return total;
  };

  const getTax = () => {
    return 0; // You can add tax calculation here
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const handleContinueFromEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setCurrentStep(2);
    } else {
      alert('Please enter your email address');
    }
  };

  const handleContinueFromDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && phone && address && city && state && pincode) {
      setCurrentStep(3);
    } else {
      alert('Please fill in all delivery details');
    }
  };

  const handlePayment = () => {
    // Razorpay integration
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
      amount: Math.round(getTotal() * 100), // Amount in paise
      currency: 'INR',
      name: 'granger vintage',
      description: 'Purchase from granger vintage',
      image: '/logo.png',
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Clear cart
        localStorage.removeItem('cart');
        // Redirect to success page
        router.push('/order-success');
      },
      prefill: {
        name: `${firstName} ${lastName}`,
        email: email,
        contact: phone
      },
      notes: {
        address: `${address}, ${city}, ${state} - ${pincode}`
      },
      theme: {
        color: '#000000'
      }
    };

    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      alert('Payment gateway not loaded. Please refresh the page.');
    }
  };

  return (
    <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Left Column - Forms */}
          <div className="flex flex-col">
            <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8">granger vintage</h1>

            {/* Step 1: Email */}
            <div className="mb-8">
              <h2 className="text-[18px] md:text-[20px] font-medium text-black mb-4">Your Email</h2>
              <form onSubmit={handleContinueFromEmail}>
                <div className="mb-4">
                  <label className="text-[12px] text-gray-600 mb-2 block">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    disabled={currentStep > 1}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                  />
                  <p className="text-[11px] text-gray-500 mt-2">
                    You'll receive receipts and notifications at this email
                  </p>
                </div>
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      disabled={currentStep > 1}
                      className="w-4 h-4"
                    />
                    <span className="text-[13px] text-black">Sign up to receive news and updates</span>
                  </label>
                </div>
                {currentStep === 1 && (
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-black text-white text-[14px] font-bold hover:bg-gray-800 transition-colors"
                  >
                    CONTINUE
                  </button>
                )}
              </form>
            </div>

            {/* Step 2: Delivery */}
            {currentStep >= 2 && (
              <div className="mb-8">
                <h2 className="text-[18px] md:text-[20px] font-medium text-black mb-4">Delivery</h2>
                <form onSubmit={handleContinueFromDelivery}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">FIRST NAME *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">LAST NAME *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-[12px] text-gray-600 mb-2 block">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={currentStep > 2}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-[12px] text-gray-600 mb-2 block">ADDRESS *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address"
                      required
                      disabled={currentStep > 2}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">CITY *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">STATE *</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">PINCODE *</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-gray-600 mb-2 block">COUNTRY *</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        disabled={currentStep > 2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  {currentStep === 2 && (
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-black text-white text-[14px] font-bold hover:bg-gray-800 transition-colors"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep >= 3 && (
              <div className="mb-8">
                <h2 className="text-[18px] md:text-[20px] font-medium text-black mb-4">Payment</h2>
                <p className="text-[14px] text-gray-600 mb-4">
                  Click below to proceed with secure payment via Razorpay
                </p>
              </div>
            )}

            {/* Step 4: Review & Purchase */}
            {currentStep >= 3 && (
              <div>
                <h2 className="text-[18px] md:text-[20px] font-medium text-black mb-4">Review & Purchase</h2>
                <button
                  onClick={handlePayment}
                  className="w-full px-8 py-4 bg-black text-white text-[14px] font-bold hover:bg-gray-800 transition-colors"
                >
                  PAY NOW - ${getTotal().toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-gray-50 p-6 md:p-8 h-fit sticky top-24">
            <h2 className="text-[20px] font-bold text-black mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="flex flex-col gap-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-white border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-black">{item.name}</h3>
                    <p className="text-[12px] text-gray-600">Qty {item.quantity}</p>
                  </div>
                  <div className="text-[14px] font-medium text-black">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-[14px] text-black">Subtotal</span>
                <span className="text-[14px] font-medium text-black">${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-[14px] text-black">Tax</span>
                <span className="text-[14px] font-medium text-black">${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-4">
                <span className="text-[18px] font-bold text-black">Total</span>
                <span className="text-[18px] font-bold text-black">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SECURE SSL CHECKOUT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutContent;
