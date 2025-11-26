import React from 'react';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';
import { Product } from './NewArrivals'; // Reuse Product type

export interface CirclesCollectionContent {
  heading: string;
  description: string;
  link_text: string;
}

interface CirclesCollectionProps {
  content?: CirclesCollectionContent;
  products?: Product[];
  onUpdateContent?: (key: keyof CirclesCollectionContent, value: string) => Promise<void>;
  onUpdateProduct?: (productId: string, key: keyof Product, value: any) => Promise<void>;
  isEditing?: boolean;
}

const defaultContent: CirclesCollectionContent = {
  heading: '— Circles & Spheres Collection',
  description: 'Fun and spherical candles, vases, and lamps.',
  link_text: 'Shop Collection',
};

const defaultProducts: Product[] = [
  {
    id: 'orb-light',
    name: 'Orb Light',
    price: 80.00,
    image_url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=600&q=80',
  },
  {
    id: 'circular-candle',
    name: 'Circular Candle',
    price: 15.00,
    image_url: 'https://images.unsplash.com/photo-1602874801006-94c0f0c1b90c?w=600&q=80',
  },
  {
    id: 'crystal-ball-sculpture',
    name: 'Crystal Ball Sculpture',
    price: 100.00,
    image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
  },
];

const CirclesCollection: React.FC<CirclesCollectionProps> = ({
  content = defaultContent,
  products = defaultProducts,
  onUpdateContent = async () => { },
  onUpdateProduct = async () => { },
  isEditing = false,
}) => {
  return (
    <section className="w-full bg-[#FAF9F6] py-20">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row gap-12 md:justify-between">
          {/* Left Column - Text (Fixed Position) */}
          <div className="flex flex-col md:w-[400px] flex-shrink-0">
            <div className="mb-4 md:mb-6">
              <EditableText
                initialValue={content.heading}
                onSave={(val) => onUpdateContent('heading', val)}
                isEditing={isEditing}
                tag="h2"
                className="text-[18px] md:text-[22px] font-bold text-black"
              />
            </div>
            <div className="mb-6 md:mb-8">
              <EditableText
                initialValue={content.description}
                onSave={(val) => onUpdateContent('description', val)}
                isEditing={isEditing}
                tag="p"
                className="text-[11px] text-black"
                multiline
              />
            </div>
            <div>
              <EditableText
                initialValue={content.link_text}
                onSave={(val) => onUpdateContent('link_text', val)}
                isEditing={isEditing}
                tag="span" // Using span inside 'a' tag might be tricky if editable. 
                // Better to make the whole link editable text or just the text.
                // Since it's a link, clicking it navigates.
                // If isEditing, we should prevent navigation.
                className="text-[11px] text-black underline hover:opacity-70 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column - Product Grid (Larger) */}
          <div className="flex-1 flex justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-[1200px]">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <div className="w-full h-[300px] md:h-[450px] mb-3 overflow-hidden">
                    <EditableImage
                      src={product.image_url}
                      alt={product.name}
                      onSave={(val) => onUpdateProduct(product.id, 'image_url', val)}
                      isEditing={isEditing}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mb-1">
                    <EditableText
                      initialValue={product.name}
                      onSave={(val) => onUpdateProduct(product.id, 'name', val)}
                      isEditing={isEditing}
                      tag="h3"
                      className="text-[10px] text-black whitespace-nowrap"
                    />
                  </div>
                  <div>
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
                      className="text-[10px] text-black whitespace-nowrap"
                    />
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

export default CirclesCollection;

