import React from 'react';

const FoundFlorals: React.FC = () => {
  return (
    <section className="w-full bg-[#3A3A3A] py-20">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row gap-12 md:justify-between">
          {/* Left Column - Text (Fixed Position) */}
          <div className="flex flex-col md:w-[400px] flex-shrink-0">
            <h2 className="text-[22px] font-bold text-white mb-6 whitespace-nowrap">— Found Florals Collection</h2>
            <p className="text-[11px] text-white mb-8">
              Antique vases, and odd shaped containers for flowers or trinkets.
            </p>
            <a href="/shop" className="text-[11px] text-yellow-400 underline hover:opacity-70 whitespace-nowrap">
              Shop Collection
            </a>
          </div>

          {/* Right Column - Product Grid */}
          <div className="flex-1 flex justify-end">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1200px]">
              {/* Product 1 */}
              <div className="flex flex-col">
                <div className="w-full h-[450px] mb-3 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80"
                    alt="Bubble Vase"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[10px] text-white mb-1 whitespace-nowrap">Bubble Vase</h3>
                <p className="text-[10px] text-white whitespace-nowrap">$15.00</p>
              </div>

              {/* Product 2 */}
              <div className="flex flex-col">
                <div className="w-full h-[450px] mb-3 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80"
                    alt="Antique Vases (set of 3)"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[10px] text-white mb-1 whitespace-nowrap">Antique Vases (set of 3)</h3>
                <p className="text-[10px] text-white whitespace-nowrap">$40.00</p>
              </div>

              {/* Product 3 */}
              <div className="flex flex-col">
                <div className="w-full h-[450px] mb-3 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&q=80"
                    alt="Pint Vase"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-3 py-1">
                    SALE
                  </span>
                </div>
                <h3 className="text-[10px] text-white mb-1 whitespace-nowrap">Pint Vase</h3>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-white whitespace-nowrap">$10.00</p>
                  <p className="text-[10px] text-gray-400 line-through whitespace-nowrap">$15.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundFlorals;
