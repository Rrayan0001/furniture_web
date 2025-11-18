import React from 'react';

const CirclesCollection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF9F6] py-20">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row gap-12 md:justify-between">
          {/* Left Column - Text (Fixed Position) */}
          <div className="flex flex-col md:w-[400px] flex-shrink-0">
            <h2 className="text-[18px] md:text-[22px] font-bold text-black mb-4 md:mb-6">— Circles & Spheres Collection</h2>
            <p className="text-[11px] text-black mb-6 md:mb-8">
              Fun and spherical candles, vases, and lamps.
            </p>
            <a href="/shop" className="text-[11px] text-black underline hover:opacity-70">
              Shop Collection
            </a>
          </div>

          {/* Right Column - Product Grid (Larger) */}
          <div className="flex-1 flex justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-[1200px]">
              {/* Product 1 */}
              <div className="flex flex-col">
                <div className="w-full h-[300px] md:h-[450px] mb-3 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&q=80"
                    alt="Orb Light"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[10px] text-black mb-1 whitespace-nowrap">Orb Light</h3>
                <p className="text-[10px] text-black whitespace-nowrap">$80.00</p>
              </div>

              {/* Product 2 */}
              <div className="flex flex-col">
                <div className="w-full h-[300px] md:h-[450px] mb-3 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=600&q=80"
                    alt="Circular Candle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[10px] text-black mb-1 whitespace-nowrap">Circular Candle</h3>
                <p className="text-[10px] text-black whitespace-nowrap">$15.00</p>
              </div>

              {/* Product 3 */}
              <div className="flex flex-col">
                <div className="w-full h-[300px] md:h-[450px] mb-3 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80"
                    alt="Crystal Ball Sculpture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[10px] text-black mb-1 whitespace-nowrap">Crystal Ball Sculpture</h3>
                <p className="text-[10px] text-black whitespace-nowrap">$100.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CirclesCollection;
