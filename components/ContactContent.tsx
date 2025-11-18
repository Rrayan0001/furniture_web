import React from 'react';

const ContactContent: React.FC = () => {
  return (
    <>
      {/* First Section - Image and Contact Info */}
      <section className="w-full bg-[#FAF9F6] pt-[100px] pb-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            {/* Left Column - Image */}
            <div className="flex-1">
              <div className="w-full h-[500px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
                  alt="Vintage furniture setup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="flex-1 flex flex-col">
              <h1 className="text-[48px] font-bold text-black mb-12">Contact Us</h1>
              
              {/* General Inquiries */}
              <div className="mb-10">
                <h3 className="text-[14px] font-bold text-black mb-3">General Inquiries</h3>
                <p className="text-[14px] text-black mb-1">+1234567890</p>
                <p className="text-[14px] text-black">info@example.com</p>
              </div>

              {/* Sales & Stockist */}
              <div className="mb-10">
                <h3 className="text-[14px] font-bold text-black mb-3">Sales & Stockist</h3>
                <p className="text-[14px] text-black mb-1">+1234567890</p>
                <p className="text-[14px] text-black">sales@example.com</p>
              </div>

              {/* Press */}
              <div>
                <h3 className="text-[14px] font-bold text-black mb-3">Press</h3>
                <p className="text-[14px] text-black mb-1">+1234567890</p>
                <p className="text-[14px] text-black">press@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Other Inquiries Form */}
      <section className="w-full bg-[#FAF9F6] pb-20">
        <div className="w-full px-8">
          <div className="flex flex-col md:flex-row gap-16 md:justify-between">
            {/* Left - Form Title */}
            <div className="md:w-[300px] flex-shrink-0">
              <h2 className="text-[32px] font-bold text-black">Other Inquiries</h2>
            </div>

            {/* Right - Form */}
            <div className="flex-1 max-w-[800px] md:mr-0">
              <form className="flex flex-col gap-6">
                {/* Name Fields */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[12px] text-black mb-2 block">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[12px] text-black mb-2 block">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[12px] text-black mb-2 block">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[12px] text-black mb-2 block">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-[12px] text-black mb-2 block">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black text-[14px] focus:outline-none focus:border-black resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Thank you for your inquiry! We will get back to you soon.');
                  }}
                  className="w-fit px-12 py-3 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactContent;
