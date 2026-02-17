'use client';

import React, { Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import PropertyCarousel from '../../components/PropertyCarousel';
import Explore from '../../components/Explore';
import Newletter from '../../components/Newletter';
import Hero from '../../components/Hero';
import Anima from '../../components/Anima';
import FAQComponent from '../../components/FAQ';
import PropertyCarouselSkeleton from "../../components/PropertyCarouselSkeleton";
// import PropertyVideoSlider from '../../components/PropertiesVideo';
import Whatwedo from '../../components/Whatwedo';
import Image from 'next/image';



const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const affiliates = [
    { photo: "/aff.png" },
    { photo: "/afff.png" },
    { photo: "/affffff.png" },
    { photo: "/affff.png" },
  ];

export default function Home() {
  return (
    <div >
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Hero />
       
      </motion.div>
       {/* Hero Text */}
      <motion.div
        className="hero-text text-center px-4 mt-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <h1 className="text-3xl font-bold text-[#192839] mb-2">
          Find Your Ideal <span className='text-red'>Home</span> in Nigeria.
        </h1>

       
        <p className="text-gray-600 dark:text-gray-300">
          BrightO provides powerful tools and trusted services to help you search, buy or sell with confidence.
        </p>
      </motion.div>
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
>
  <Suspense fallback={<PropertyCarouselSkeleton />}>
    <PropertyCarousel />
  </Suspense>
</motion.div>
  {/* Affiliates Section */}
<div className="py-12 px-4 sm:px-6 lg:px-16 mt-4">
  <h1 className="text-center text-2xl sm:text-3xl font-bold mb-12 uppercase text-black">
    Our Affiliates
  </h1>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center items-center">
    {affiliates.map((affi, index) => (
      <motion.div
        key={index}
      initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
      >
        <Image
          src={affi.photo}
          alt=""
          width={130}
          height={130}
          className="w-[130px] h-[130px] object-fill rounded-md"
        />
      </motion.div>
    ))}
  </div>
</div>


      {/* Explore Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Explore />
      </motion.div>
         <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Anima />
      </motion.div>

      
      {/* Feature Cards */}
      <motion.div
        className="max-w-7xl mx-auto mb-12 mt-8 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
         <Whatwedo />

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
          {[
            {
              icon: 'https://cdn.lordicon.com/msoeawqm.json',
              title: 'Find Your Home',
              desc: 'Explore listings tailored to your lifestyle and budget across Nigeria.',
              extra: 'Peaceful, connected areas for families and professionals.',
            },
            {
              icon: 'https://cdn.lordicon.com/nocovwne.json',
              title: ' Rent, Love, Live',
              desc: 'Filter properties by location, type, price, and more.',
              extra: 'Home buying can be a stressful process, but we take the guess work out of finding a real estate agent.',
            },
            {
              icon: 'https://cdn.lordicon.com/bhfjfgqz.json',
              title: ' Verified Agents',
              desc: 'Connect with trusted real estate agents ready to help.',
              extra: 'We vet all agents to ensure you get the best service.',
            },
            {
               icon: 'https://cdn.lordicon.com/tdrtiskw.json',
              title: ' Market Insights',
              desc: 'Stay ahead with real-time pricing trends and opportunities.',
              extra: 'Make informed decisions with our comprehensive market data.',
            },
            {
               icon: 'https://cdn.lordicon.com/tftaqjwp.json',
              title: ' 24/7 Support',
              desc: 'Get expert help any time — our team is always available.',
              extra: 'Whether you have questions or need assistance, we’re here for you.',
            },
            {
              icon: 'https://cdn.lordicon.com/pflszboa.json',
              title: ' Secure Deals',
              desc: 'Buy or rent with confidence — all listings are verified.',
              extra: 'We ensure every property meets our high standards for quality and safety.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white shadow-md rounded-lg p-6 text-center dark:bg-gray-800 dark:text-white"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                    <lord-icon
                      src="${item.icon}"
                      trigger="hover"
                      colors="primary:#121331,secondary:#08a88a"
                      style="width:80px;height:100px">
                    </lord-icon>`,
                }}
              />
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              {item.extra && (
                <p className="text-gray-600 dark:text-gray-300">{item.extra}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
     
       <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <FAQComponent />
      </motion.div>

        {/* <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <PropertyVideoSlider />
      </motion.div> */}

      {/* Newsletter Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Newletter />
      </motion.div>
    </div>
  );
}
