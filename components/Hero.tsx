import React from 'react';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';

export interface HeroContent {
  heading: string;
  subtext: string;
  est_year: string;
  est_description: string;
  image_1: string;
  image_2: string;
}

interface HeroProps {
  content?: HeroContent;
  onUpdate?: (key: keyof HeroContent, value: string) => Promise<void>;
  isEditing?: boolean;
}

const defaultContent: HeroContent = {
  heading: 'Midcentury Modern, Vintage,\n& Retro Home Decor',
  subtext: 'Based out of Austin, TX.',
  est_year: '2018',
  est_description: 'Originally established in March 2018 out of a storage unit, our home decor store was born from a love of all things mid-century modern, vintage, and retro.',
  image_1: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  image_2: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
};

const Hero: React.FC<HeroProps> = ({
  content = defaultContent,
  onUpdate = async () => { },
  isEditing = false
}) => {
  return (
    <section className={`w-full bg-[#FAF9F6] ${isEditing ? 'pt-[140px]' : 'pt-[80px]'} pb-32`}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col">
          {/* Main Heading */}
          <div className="mb-8">
            <EditableText
              initialValue={content.heading}
              onSave={(val) => onUpdate('heading', val)}
              isEditing={isEditing}
              tag="h1"
              className="text-[32px] md:text-[48px] leading-[1.1] font-bold text-black whitespace-pre-line"
              multiline
            />
          </div>

          {/* Images Row - Bottom Aligned */}
          <div className="flex flex-col md:flex-row gap-8 items-end md:justify-between mb-20">
            {/* Left Image */}
            <div className="w-full md:w-auto">
              <EditableImage
                src={content.image_1}
                alt="White retro desk lamp on wooden stool"
                onSave={(val) => onUpdate('image_1', val)}
                isEditing={isEditing}
                className="w-full max-w-[385px] h-auto object-cover"
              />
            </div>

            {/* Right Column - Text and Image */}
            <div className="flex flex-col justify-end md:mr-0">
              <div className="mb-6">
                <EditableText
                  initialValue={content.subtext}
                  onSave={(val) => onUpdate('subtext', val)}
                  isEditing={isEditing}
                  tag="p"
                  className="text-[18px] font-semibold text-black"
                />
              </div>
              <div className="w-full">
                <EditableImage
                  src={content.image_2}
                  alt="Retro lamps on pastel background"
                  onSave={(val) => onUpdate('image_2', val)}
                  isEditing={isEditing}
                  className="w-full max-w-[385px] h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Est. 2018 Section */}
          <div className="flex flex-col md:flex-row gap-8 mt-16 md:justify-between md:items-end">
            {/* Left - Est. 2018 */}
            <div className="flex flex-col">
              <p className="text-[14px] md:text-[16px] font-bold text-black mb-2">est.</p>
              <EditableText
                initialValue={content.est_year}
                onSave={(val) => onUpdate('est_year', val)}
                isEditing={isEditing}
                tag="h2"
                className="text-[80px] md:text-[160px] leading-[0.85] font-bold text-black"
              />
            </div>

            {/* Right - Description */}
            <div className="flex items-end md:max-w-[450px] md:pb-2">
              <EditableText
                initialValue={content.est_description}
                onSave={(val) => onUpdate('est_description', val)}
                isEditing={isEditing}
                tag="p"
                className="text-[12px] md:text-[14px] leading-relaxed text-black"
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

