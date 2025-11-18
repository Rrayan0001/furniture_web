import React from 'react';

const AboutContent: React.FC = () => {
  return (
    <section className="w-full bg-black pt-[100px] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left Column - Text */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-[28px] md:text-[42px] leading-[1.1] font-bold text-white mb-8 md:mb-12">
              Established in 2018<br />
              in Austin, Texas
            </h1>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-white max-w-[450px]">
              It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Or maybe you have a creative project to share with the world. Whatever it is, the way you tell your story online can make all the difference. Don't worry about sounding professional. Sound like you.
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1">
            <div className="w-full h-[300px] md:h-[450px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80"
                alt="Vintage home decor setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
