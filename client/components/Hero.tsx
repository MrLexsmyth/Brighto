'use client';
import React from 'react';
import Image from "next/legacy/image";
import CountUp from 'react-countup';
import heroBg from '../public/estate.jpg'; 
import ScrollIndicator from '../components/ScrollIndicator';
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-[100vh] mb-8 overflow-hidden">
      {/* Background Image */}
      <Image
        src={heroBg}
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 z-0"
        priority
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      {/* Text Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start text-left px-4 md:px-20 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
          Discover the Perfect Place to Call Home.
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-lg">
          Explore premium homes available for purchase or lease in your preferred areas.
        </p>
      <Link href="/estate/listings">
  <button className="bg-[#004274] hover:bg-[#0090d2] text-white px-6 py-3 rounded-md font-semibold transition duration-300">
    Get Started
  </button>
</Link>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {/* Block 1 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              <CountUp end={500} duration={2} />+
            </h1>
            <p className="text-sm text-white">Verified listings</p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-200"></div>

          {/* Block 2 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              <CountUp end={200} duration={2} separator="," />+
            </h1>
            <p className="text-sm text-white">Happy clients served</p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-200"></div>

          {/* Block 3 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              <CountUp end={38} duration={2} separator="," />
            </h1>
            <p className="text-sm text-white">Prime Locations</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 mb-14">
        <ScrollIndicator />
      </div>

      {/* Wavy Bottom */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-[100px]" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,192L60,213.3C120,235,240,277,360,261.3C480,245,600,171,720,154.7C840,139,960,181,1080,202.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
