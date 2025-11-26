import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const CategoryPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCategoryAndProducts(slug as string);
        }
    }, [slug]);

    const fetchCategoryAndProducts = async (categorySlug: string) => {
        setLoading(true);

        // 1. Fetch Category
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', categorySlug)
            .single();

        if (categoryError || !categoryData) {
            console.error('Error fetching category:', categoryError);
            setLoading(false);
            return;
        }

        setCategory(categoryData);

        // 2. Fetch Products for this Category
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', (categoryData as any).id)
            .eq('is_available', true);

        if (productsError) {
            console.error('Error fetching products:', productsError);
        } else {
            setProducts(productsData || []);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p>Category not found.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
            <Header />

            <main className="flex-1 pt-[120px] pb-20 px-8 max-w-[1400px] mx-auto w-full">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
                    {category.description && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div key={product.id} className="flex flex-col group cursor-pointer">
                                <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
                                    {product.main_image_url ? (
                                        <img
                                            src={product.main_image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    {product.sale_price && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                                            Sale
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-medium text-black mb-1">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    {product.sale_price ? (
                                        <>
                                            <span className="text-gray-400 line-through">${product.price}</span>
                                            <span className="text-black font-medium">${product.sale_price}</span>
                                        </>
                                    ) : (
                                        <span className="text-black font-medium">${product.price}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CategoryPage;
