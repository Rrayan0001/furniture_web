import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
    } else if (data) {
      setProduct(data);
      setSelectedImage((data as any).main_image_url);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined' && product) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const existingItem = cart.find((item: any) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.sale_price || product.price, // Use sale price if available
          image: product.main_image_url,
          quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Added ${quantity} x ${product.name} to cart!`);

      // Redirect to cart page
      setTimeout(() => {
        router.push('/cart');
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-[#FAF9F6]">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center bg-[#FAF9F6] pt-[100px]">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <a href="/shop" className="underline">Return to Shop</a>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [product.main_image_url, ...(product.additional_images || [])].filter(Boolean);

  return (
    <>
      <Head>
        <title>{product.name} - granger vintage</title>
        <meta name="description" content={product.description} />
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />

        {/* Breadcrumb */}
        <div className="pt-[120px] px-4 md:px-8 max-w-[1400px] mx-auto">
          <p className="text-[12px] text-black mb-8">
            <a href="/shop" className="hover:opacity-70">Shop</a> &gt; {product.name}
          </p>
        </div>

        {/* Product Detail */}
        <section className="w-full bg-[#FAF9F6] pb-20">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Left - Product Media */}
              <div className="w-full">
                <div className="w-full aspect-square bg-white mb-4 relative overflow-hidden rounded-lg">
                  {show3D && product.model_url ? (
                    <model-viewer
                      src={product.model_url}
                      alt={`3D model of ${product.name}`}
                      auto-rotate
                      camera-controls
                      style={{ width: '100%', height: '100%' }}
                    ></model-viewer>
                  ) : (
                    <img
                      src={selectedImage || 'https://via.placeholder.com/600x600?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* 3D Toggle Button */}
                  {product.model_url && (
                    <button
                      onClick={() => setShow3D(!show3D)}
                      className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors z-10"
                    >
                      {show3D ? 'View Image' : 'View in 3D'}
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {allImages.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(img);
                          setShow3D(false);
                        }}
                        className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${selectedImage === img && !show3D ? 'border-black' : 'border-transparent'}`}
                      >
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right - Product Info */}
              <div className="flex flex-col">
                <h1 className="text-[32px] md:text-[40px] font-bold text-black mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  {product.sale_price ? (
                    <>
                      <p className="text-[24px] md:text-[28px] text-gray-400 line-through">${product.price}</p>
                      <p className="text-[24px] md:text-[28px] text-red-600 font-bold">${product.sale_price}</p>
                    </>
                  ) : (
                    <p className="text-[24px] md:text-[28px] text-black">${product.price}</p>
                  )}
                </div>

                <p className="text-[14px] md:text-[16px] leading-relaxed text-black mb-8 whitespace-pre-wrap">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-[14px] text-black mb-2 block font-medium">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-black w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-black hover:bg-gray-100 text-[18px]"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center border-x border-black bg-transparent text-black text-[16px]"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-black hover:bg-gray-100 text-[18px]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_available}
                  className={`w-full md:w-auto px-12 py-4 border-2 border-black text-[16px] font-bold transition-colors ${product.is_available
                    ? 'bg-white text-black hover:bg-black hover:text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200'
                    }`}
                >
                  {product.is_available ? 'Add To Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
