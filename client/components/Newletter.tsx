import React from 'react';
import Image from 'next/image';

import NewsletterImage from '../public/newsletter.jpg'; 

const Newletter = () => {
  return (
    <div className="w-full h-[400px] flex flex-col md:flex-row">

   <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 bg-darkblue">
  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
    Subscribe Newsletter
  </h1>
  <p className="text-white mb-6">
    Subscribe to our newsletter to get the latest updates and property listings directly in your inbox.
  </p>

  <div className="flex w-full max-w-md">
    <input
      type="email"
      placeholder="Enter your email"
      className="flex-1 px-4 py-2 rounded-l-md border-none focus:outline-none text-black"
    />
    <button className="bg-[#00aeff] hover:bg-[#0090d2] text-white px-4 py-2 rounded-r-md font-semibold transition-colors duration-300">
      Subscribe
    </button>
  </div>
</div>
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
  <Image
    src={NewsletterImage}
    alt="Newsletter"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
    </div>
  );
};

export default Newletter;
