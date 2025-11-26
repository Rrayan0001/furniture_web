import React from 'react';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';
import { Product } from './NewArrivals';

export interface FoundFloralsContent {
  heading: string;
  description: string;
  link_text: string;
}

interface FoundFloralsProps {
  content?: FoundFloralsContent;
  products?: Product[];
  onUpdateContent?: (key: keyof FoundFloralsContent, value: string) => Promise<void>;
  onUpdateProduct?: (productId: string, key: keyof Product, value: any) => Promise<void>;
  isEditing?: boolean;
}

const defaultContent: FoundFloralsContent = {
  heading: '— Found Florals Collection',
  description: 'Antique vases, and odd shaped containers for flowers or trinkets.',
  link_text: 'Shop Collection',
};

const defaultProducts: Product[] = [
  {
    id: 'bubble-vase',
    name: 'Bubble Vase',
    price: 15.00,
    image_url: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&q=80',
  },
  {
    id: 'antique-vases',
    name: 'Antique Vases (set of 3)',
    price: 40.00,
    image_url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80',
  },
  {
    id: 'pint-vase',
    name: 'Pint Vase',
    price: 10.00,
    image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&q=80',
  },
];

const FoundFlorals: React.FC<FoundFloralsProps> = ({
  content = defaultContent,
  products = defaultProducts,
  onUpdateContent = async () => { },
  onUpdateProduct = async () => { },
  isEditing = false,
}) => {
  return (
    <section className="w-full bg-[#3A3A3A] py-20">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row gap-12 md:justify-between">
          {/* Left Column - Text (Fixed Position) */}
          <div className="flex flex-col md:w-[400px] flex-shrink-0">
            <div className="mb-6">
              <EditableText
                initialValue={content.heading}
                onSave={(val) => onUpdateContent('heading', val)}
                isEditing={isEditing}
                tag="h2"
                className="text-[22px] font-bold text-white whitespace-nowrap"
              />
            </div>
            <div className="mb-8">
              <EditableText
                initialValue={content.description}
                onSave={(val) => onUpdateContent('description', val)}
                isEditing={isEditing}
                tag="p"
                className="text-[11px] text-white"
                multiline
              />
            </div>
            <div>
              <EditableText
                initialValue={content.link_text}
                onSave={(val) => onUpdateContent('link_text', val)}
                isEditing={isEditing}
                tag="span"
                className="text-[11px] text-yellow-400 underline hover:opacity-70 whitespace-nowrap cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column - Product Grid */}
          <div className="flex-1 flex justify-end">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1200px]">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <div className="w-full h-[450px] mb-3 overflow-hidden relative">
                    <EditableImage
                      src={product.image_url}
                      alt={product.name}
                      onSave={(val) => onUpdateProduct(product.id, 'image_url', val)}
                      isEditing={isEditing}
                      className="w-full h-full object-cover"
                    />
                    {/* Hardcoded SALE badge for now, could be dynamic later */}
                    {product.id === 'pint-vase' && (
                      <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-3 py-1">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <EditableText
                      initialValue={product.name}
                      onSave={(val) => onUpdateProduct(product.id, 'name', val)}
                      isEditing={isEditing}
                      tag="h3"
                      className="text-[10px] text-white whitespace-nowrap"
                    />
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="text-[10px] text-white whitespace-nowrap"
                    />
                    {/* Hardcoded original price for sale item */}
                    {product.id === 'pint-vase' && (
                      <p className="text-[10px] text-gray-400 line-through whitespace-nowrap">$15.00</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundFlorals;

