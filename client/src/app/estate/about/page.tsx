'use client';
import React from 'react';
import Image from 'next/image';

import { motion, Variants } from 'framer-motion';
import Newletter from '../../../../components/Newletter';
import NewsletterImag from '../../../../public/newsletter.jpg';

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOut cubic
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2 },
  },
};

const AboutPage = () => {
  return (
    <section>
      {/* ---------- Hero Section ---------- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full h-64 relative"
      >
        <Image
          src={NewsletterImag}
          alt="Newsletter"
          fill
          priority
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-blue text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center">
            About Us
          </h2>
        </div>
      </motion.div>

      {/* ---------- Hero Text ---------- */}
      <motion.h1
        className="section-heading text-blue px-6 text-center mt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        We&apos;re dedicated to helping people find homes that reflect their lifestyle and dreams.
        Explore the journey behind our platform.
      </motion.h1>

      {/* ---------- Zigzag Section ---------- */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-20 px-6 py-12 max-w-7xl mx-auto"
      >
        {/* Our Mission */}
        <motion.div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-blue mb-2 mt-2">Our Mission</h2>
            <p className="text-gray-700 text-base leading-7 mb-3">
              At BrightO, our mission is simple: to simplify the process of finding, renting, or
              buying a home through a modern and intuitive platform.
            </p>
            <p className="text-gray-700 text-base leading-7 mb-3">
              We blend technology and a human-centered approach to give you transparency, speed, and
              access to curated listings across Nigeria and beyond.
            </p>
            <p className="text-gray-700 text-base leading-7">
              Whether you&apos;re a first-time buyer, an investor, or just exploring, BrightO is your
              trusted companion on every step of the journey.
            </p>
          </div>
          <div className="md:w-1/2 hidden md:block">
            <div className="relative w-full h-72 md:h-96 rounded-md"></div>
          </div>
        </motion.div>

        {/* Our Vision */}
        <motion.div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 hidden md:block">
            <div className="relative w-full h-72 md:h-96  rounded-md"></div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-blue mb-4 mt-4">Our Vision</h2>
            <p className="text-gray-700 text-base leading-7 mb-3">
              We envision a world where finding a home is as easy as a few clicks, where technology
              empowers people to make informed decisions, and where every individual has access to
              the best properties available.
            </p>
            <p className="text-gray-700 text-base leading-7">
              BrightO aims to be the leading platform that connects people with their dream homes,
              transforming the real estate experience for everyone.
            </p>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div className="flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-blue mb-4 mt-4">Our Values</h2>
            <p className="text-gray-700 text-base leading-7 mb-3">
              We believe in transparency, integrity, and innovation. Our platform is designed to
              empower users with the information they need to make informed decisions.
            </p>
            <p className="text-gray-700 text-base leading-7 mb-3">
              We are committed to providing exceptional customer service and building lasting
              relationships with our users.
            </p>
            <p className="text-gray-700 text-base leading-7">
              At BrightO, we strive to create a community where everyone feels valued and supported
              in their real estate journey.
            </p>
          </div>
         <div className="hidden md:block md:w-1/2">
  <div className="relative w-full h-96 rounded-md"></div>
</div>
        </motion.div>
      </motion.section>

      {/* ---------- Newsletter Section ---------- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <Newletter />
      </motion.div>
    </section>
  );
};

export default AboutPage;
