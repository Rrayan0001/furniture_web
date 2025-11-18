import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF9F6] pt-[80px] pb-32">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col">
          {/* Main Heading */}
          <h1 className="text-[32px] md:text-[48px] leading-[1.1] font-bold text-black mb-8">
            Midcentury Modern, Vintage,<br />
            & Retro Home Decor
          </h1>

          {/* Images Row - Bottom Aligned */}
          <div className="flex flex-col md:flex-row gap-8 items-end md:justify-between mb-20">
            {/* Left Image */}
            <div className="w-full md:w-auto">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
                alt="White retro desk lamp on wooden stool"
                className="w-full max-w-[385px] h-auto object-cover"
              />
            </div>

            {/* Right Column - Text and Image */}
            <div className="flex flex-col justify-end md:mr-0">
              <p className="text-[18px] font-semibold text-black mb-6">
                Based out of Austin, TX.
              </p>
              <div className="w-full">
                <img
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80"
                  alt="Retro lamps on pastel background"
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
              <h2 className="text-[80px] md:text-[160px] leading-[0.85] font-bold text-black">2018</h2>
            </div>

            {/* Right - Description */}
            <div className="flex items-end md:max-w-[450px] md:pb-2">
              <p className="text-[12px] md:text-[14px] leading-relaxed text-black">
                Originally established in March 2018 out of a storage unit, our home decor store was born from a love of all things mid-century modern, vintage, and retro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
