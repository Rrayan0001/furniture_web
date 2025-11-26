import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(4); // Show top 4 categories

      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF9F6] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-20 gap-y-12 md:gap-y-20">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center">
              <div className="w-full max-w-[300px] md:max-w-[500px] aspect-square rounded-full overflow-hidden mb-4 md:mb-6 bg-gray-200">
                {category.thumbnail_url ? (
                  <img
                    src={category.thumbnail_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <Link href={`/category/${category.slug}`}>
                <button className="px-6 md:px-8 py-2 md:py-3 border-2 border-black text-black text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors">
                  Shop {category.name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
