import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const ShopContent: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch Categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesData) setCategories(categoriesData);

    // Fetch Products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (productsData) setProducts(productsData);

    setLoading(false);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  return (
    <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Page Title */}
        <h1 className="text-[32px] md:text-[48px] font-bold text-black mb-8 md:mb-12">Shop</h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Sidebar - Categories */}
          <aside className="w-full md:w-[200px] flex-shrink-0">
            <nav className="flex flex-row md:flex-col gap-4 overflow-x-auto pb-4 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-[14px] md:text-[16px] text-left whitespace-nowrap ${selectedCategory === 'all' ? 'font-bold text-black' : 'text-gray-600 hover:text-black'}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-[14px] md:text-[16px] text-left whitespace-nowrap ${selectedCategory === category.id ? 'font-bold text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content - Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="flex flex-col group cursor-pointer">
                    <div className="w-full h-[250px] md:h-[350px] mb-4 overflow-hidden bg-gray-100 relative">
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {product.sale_price && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase">
                          Sale
                        </div>
                      )}
                    </div>
                    <h3 className="text-[16px] font-medium text-black mb-2 group-hover:opacity-70">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-[16px] text-gray-400 line-through">${product.price}</span>
                          <span className="text-[16px] text-black font-medium">${product.sale_price}</span>
                        </>
                      ) : (
                        <span className="text-[16px] text-black">${product.price}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopContent;
