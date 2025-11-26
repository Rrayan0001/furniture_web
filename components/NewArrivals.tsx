'use client';
import React, { useState } from 'react';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface NewArrivalsContent {
  heading: string;
}

interface NewArrivalsProps {
  content?: NewArrivalsContent;
  products?: Product[];
  onUpdateContent?: (key: keyof NewArrivalsContent, value: string) => Promise<void>;
  onUpdateProduct?: (productId: string, key: keyof Product, value: any) => Promise<void>;
  isEditing?: boolean;
}

const defaultContent: NewArrivalsContent = {
  heading: '— New Arrivals',
};

const defaultProducts: Product[] = [
  {
    id: 'azul-candles',
    name: 'Azul Candles (set of 2)',
    price: 40.00,
    image_url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80',
  },
  {
    id: 'grandmas-vases',
    name: "Grandma's Vases (set of 4)",
    price: 60.00,
    image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80',
  },
];

const NewArrivals: React.FC<NewArrivalsProps> = ({
  content = defaultContent,
  products = defaultProducts,
  onUpdateContent = async () => { },
  onUpdateProduct = async () => { },
  isEditing = false,
}) => {
  // We need separate state for quantities for each product, but since products are dynamic,
  // we can just use a map or local state per item if we extract a ProductCard component.
  // For simplicity, I'll keep it inline but use a map for quantities.
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const getQuantity = (id: string) => quantities[id] || 1;
  const setQuantity = (id: string, q: number) => setQuantities({ ...quantities, [id]: q });

  const handleAddToCart = (product: Product) => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const existingItem = cart.find((item: any) => item.id === product.id);
      const quantity = getQuantity(product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: `$${product.price.toFixed(2)}`,
          image: product.image_url,
          quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Added ${quantity} x ${product.name} to cart!`);
    }
  };

  return (
    <section className="w-full bg-[#E8E8E8] py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section Title */}
        <div className="mb-8 md:mb-12">
          <EditableText
            initialValue={content.heading}
            onSave={(val) => onUpdateContent('heading', val)}
            isEditing={isEditing}
            tag="h2"
            className="text-[20px] md:text-[24px] font-bold text-black"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div className="w-full mb-4 flex justify-center bg-white"> {/* Added bg-white for better image visibility if transparent */}
                <EditableImage
                  src={product.image_url}
                  alt={product.name}
                  onSave={(val) => onUpdateProduct(product.id, 'image_url', val)}
                  isEditing={isEditing}
                  className="w-full h-auto object-cover aspect-[4/3]" // Enforce aspect ratio
                />
              </div>
              <div className="mb-1">
                <EditableText
                  initialValue={product.name}
                  onSave={(val) => onUpdateProduct(product.id, 'name', val)}
                  isEditing={isEditing}
                  tag="h3"
                  className="text-[14px] text-black"
                />
              </div>
              <div className="mb-4">
                <EditableText
                  initialValue={`$${product.price.toFixed(2)}`}
                  onSave={(val) => {
                    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
                    if (!isNaN(num)) {
                      return onUpdateProduct(product.id, 'price', num);
                    }
                    return Promise.resolve();
                  }}
                  isEditing={isEditing}
                  tag="p"
                  className="text-[14px] text-black"
                />
              </div>

              {/* Quantity and Add to Cart */}
              {!isEditing && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center border border-black w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(product.id, Math.max(1, getQuantity(product.id) - 1))}
                      className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={getQuantity(product.id)}
                      readOnly
                      className="w-12 text-center border-x border-black bg-transparent text-black"
                    />
                    <button
                      onClick={() => setQuantity(product.id, getQuantity(product.id) + 1)}
                      className="px-3 py-2 text-black hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 px-6 py-2 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors text-center"
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

