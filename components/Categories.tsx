import React from 'react';

const Categories: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF9F6] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-20 gap-y-12 md:gap-y-20">
          {/* Category 1 - Vases */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[300px] md:max-w-[500px] aspect-square rounded-full overflow-hidden mb-4 md:mb-6">
              <img
                src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80"
                alt="Vases"
                className="w-full h-full object-cover"
              />
            </div>
            <a href="/shop">
              <button className="px-6 md:px-8 py-2 md:py-3 border-2 border-black text-black text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors">
                Shop Vases
              </button>
            </a>
          </div>

          {/* Category 2 - Sculptures */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[300px] md:max-w-[500px] aspect-square rounded-full overflow-hidden mb-4 md:mb-6">
              <img
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
                alt="Sculptures"
                className="w-full h-full object-cover"
              />
            </div>
            <a href="/shop">
              <button className="px-6 md:px-8 py-2 md:py-3 border-2 border-black text-black text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors">
                Shop Sculptures
              </button>
            </a>
          </div>

          {/* Category 3 - Lighting */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[300px] md:max-w-[500px] aspect-square rounded-full overflow-hidden mb-4 md:mb-6">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
                alt="Lighting"
                className="w-full h-full object-cover"
              />
            </div>
            <a href="/shop">
              <button className="px-6 md:px-8 py-2 md:py-3 border-2 border-black text-black text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors">
                Shop Lighting
              </button>
            </a>
          </div>

          {/* Category 4 - Scents */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[300px] md:max-w-[500px] aspect-square rounded-full overflow-hidden mb-4 md:mb-6">
              <img
                src="https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=800&q=80"
                alt="Scents"
                className="w-full h-full object-cover"
              />
            </div>
            <a href="/shop">
              <button className="px-6 md:px-8 py-2 md:py-3 border-2 border-black text-black text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors">
                Shop Scents
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
