import React from 'react';

const ShopContent: React.FC = () => {
  const products = [
    {
      id: 'grandmas-vases',
      name: "Grandma's Vases (set of 4)",
      price: "$60.00",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&q=80"
    },
    {
      id: 'azul-candles',
      name: "Azul Candles (set of 2)",
      price: "$40.00",
      image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=600&q=80"
    },
    {
      id: 'rome-candle',
      name: "Rome Candle",
      price: "$40.00",
      image: "https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=600&q=80"
    },
    {
      id: 'orb-light',
      name: "Orb Light",
      price: "$80.00",
      image: "https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&q=80"
    },
    {
      id: 'circular-candle',
      name: "Circular Candle",
      price: "$15.00",
      image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80"
    },
    {
      id: 'crystal-ball-sculpture',
      name: "Crystal Ball Sculpture",
      price: "$100.00",
      image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80"
    }
  ];

  return (
    <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Page Title */}
        <h1 className="text-[32px] md:text-[48px] font-bold text-black mb-8 md:mb-12">Shop</h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Sidebar - Categories */}
          <aside className="w-full md:w-[200px] flex-shrink-0">
            <nav className="flex flex-row md:flex-col gap-4 overflow-x-auto pb-4 md:pb-0">
              <a href="#" className="text-[14px] md:text-[16px] font-bold text-black hover:opacity-70 whitespace-nowrap">
                All
              </a>
              <a href="#" className="text-[14px] md:text-[16px] text-black hover:opacity-70 whitespace-nowrap">
                Gift Card
              </a>
              <a href="#" className="text-[14px] md:text-[16px] text-black hover:opacity-70 whitespace-nowrap">
                Lighting
              </a>
              <a href="#" className="text-[14px] md:text-[16px] text-black hover:opacity-70 whitespace-nowrap">
                Scents
              </a>
              <a href="#" className="text-[14px] md:text-[16px] text-black hover:opacity-70 whitespace-nowrap">
                Vases
              </a>
              <a href="#" className="text-[14px] md:text-[16px] text-black hover:opacity-70 whitespace-nowrap">
                Sculptures
              </a>
            </nav>
          </aside>

          {/* Right Content - Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <a key={product.id} href={`/product/${product.id}`} className="flex flex-col group cursor-pointer">
                  <div className="w-full h-[250px] md:h-[350px] mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <h3 className="text-[16px] font-medium text-black mb-2 group-hover:opacity-70">{product.name}</h3>
                  <p className="text-[16px] text-black">{product.price}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopContent;
