'use client'

import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function HeroCarousel() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={5000}
      transitionTime={700}
    >
      <div>
        <Image src="/pro3.jpg" alt="Slide 1" width={1280} height={300} className="w-full h-auto object-cover" />
        <p className="legend">Modern Homes</p>
      </div>
      <div>
        <Image src="/pro3.jpg" alt="Slide 2" width={1280} height={300} className="w-full h-auto object-cover" />
        <p className="legend">Affordable Apartments</p>
      </div>
      <div>
        <Image src="/pro3.jpg" alt="Slide 3" width={1280} height={300} className="w-full h-auto object-cover" />
        <p className="legend">Luxury Estates</p>
      </div>
    </Carousel>
  );
}
