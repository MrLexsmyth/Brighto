'use client';
import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { motion, Variants } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import Property1 from '../public/property1.svg';
import Property2 from '../public/property2.svg';
import Property3 from '../public/property3.svg';
import Property4 from '../public/property4.svg';


const testimonials = [
    {
    name: "Mr Stephen Bello",
    role: "Homeowner",
     rating: 5,
    message:
      "BrightO helped me find my dream home in just a week. The service was seamless!",
    image: "/client6.jpg", 
  },
  {
    name: "Adeshina Muktar",
    role: "Homeowner",
     rating: 5,
    message:
      "BrightO helped me find my dream home in just a week. The service was seamless!",
    image: "/client4.jpg", 
  },
  {
    name: "Oladapo Titilope",
    role: "First-time Buyer",
     rating: 4,
    message:
      "BrightO is reliable, highly professional, and a pleasure to work with. I strongly recommend them.",
    image: "/client6.jpg",
  },
  {
    name: "Ogidan Afolashade",
    role: "Real Estate Investor",
     rating: 5,
    message:
      "Reliable, professional, and very easy to work with. Highly recommend BrightO.",
    image: "/client1.jpg",
  },

  {
    name: 'Shittu Olatunji',
    role: 'Investor',
     rating: 4,
    message: 'Reliable, professional, and very easy to work with. Highly recommend BrightO.',
    image: '/client3.jpeg',
  },
  {
    name: 'Oni Oyinkansola.',
    role: 'Tenant',
     rating: 5,
    message: 'Thanks to BrightO, I found a beautiful apartment within my budget.',
    image: '/client2.png',
  },
  {
    name: 'McKay Jennifer.',
    role: 'Property Owner',
     rating: 5,
    message: 'They got my property rented faster than I expected. Great platform!',
    image: '/logo3.jpg',
  },
];

const cardData = [
  { label: 'Home & Apartment', icon: Property1 },
  { label: 'Villa', icon: Property2 },
  { label: 'Studio', icon: Property3 },
  { label: 'Office', icon: Property4 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const starsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const starVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const  
    }
  }
};

const Explore = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 32 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
const carouselRef = useRef<HTMLDivElement>(null);
const [isHovered, setIsHovered] = useState(false);

// Handle autoplay
useEffect(() => {
  if (!instanceRef.current || isHovered) return;
  intervalRef.current = setInterval(() => {
    instanceRef.current?.next();
  }, 4000);
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [instanceRef, isHovered]);
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="bg-white mt-4 lg:h-[400px] rounded-lg shadow-md flex flex-col md:flex-row md:items-center dark:bg-gray-800 dark:text-white p-0 md:p-4"
      >
        <motion.div variants={cardVariants} className="p-10 w-full md:w-[35%]">
          <h1 className="text-[34px] sm:text-[32px] md:text-[38px] font-medium leading-[36px] sm:leading-[42px] md:leading-[45.6px] text-[#192839] dark:text-white">
            Explore by
            <br className="hidden lg:block" /> Property Type
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find your ideal space by browsing homes, apartments,
            <br className="hidden lg:block" />
            lands, studio, and more...
          </p>

<Link href="/listings">
<button className="relative overflow-hidden group bg-[#00aeff] text-white px-8 py-3 mt-3 rounded-md font-semibold border border-[#00aeff] transition duration-600">
   <span className="relative z-10">View All Property</span>
  <span className="absolute inset-0 bg-darkblue scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
</button>
</Link> 

        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex flex-wrap justify-around gap-4 font-medium text-[18px] leading-[24px] text-[#192839] dark:text-white w-full md:w-[65%]"
        >
          {cardData.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="proper w-full sm:w-full md:w-[48%] lg:w-[45%] h-[200px] md:h-auto gap-4 p-0 md:p-4 rounded-lg flex flex-col justify-center items-center text-center transition-colors duration-300 hover:text-[#00aeff]"
            >
              <Image 
                 src={item.icon} 
                 alt={item.label} 
                 width={60} 
                 height={60}
                 className="w-auto h-auto max-w-[60px] max-h-[60px]"
/>
              <Link
                href="/listings"
                className="mt-2 transition-colors duration-300"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
 <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Heading with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-4">
          Client Testimonials
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
          Discover what our happy clients have to say about finding their dream property with{' '}
          <span className="font-semibold text-blue-500">BrightO</span>.
        </p>
      </motion.div>

    
      <div
  ref={carouselRef}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="relative"
>
        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="keen-slider__slide bg-white dark:bg-gray-900 shadow-md p-6 rounded-2xl text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
  <Image
    src={item.image}
    alt={item.name}
    className="rounded-full object-cover"
    fill
    sizes="64px"
  />
</div>

             <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
  &ldquo;{item.message}&rdquo;
</p>

             <motion.div
  className="flex justify-center mb-2"
  variants={starsContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {[...Array(5)].map((_, i) => (
    <motion.span
      key={i}
      className={`text-yellow-400 text-xl ${i < item.rating ? '' : 'opacity-20'}`}
      variants={starVariant}
    >
      ★
    </motion.span>
  ))}
</motion.div>

              <h1 className="font-semibold text-xl text-gray-800 dark:text-white">{item.name}</h1>
              <p className="text-sm text-gray-500">{item.role}</p>
            </div>
          ))}
        </div>

        {/* Arrows */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow p-2 z-10 hover:bg-gray-200"
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow p-2 z-10 hover:bg-gray-200"
              aria-label="Next"
            >
              &#8594;
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition ${
                currentSlide === idx ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      )}
    </section>

    </section>
  );
};

export default Explore;
