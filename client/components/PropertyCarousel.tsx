'use client'

import { useEffect, useState } from 'react'
import Image from 'next/legacy/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import axios from '../utils/axios'
import Link from 'next/link'
import { BedDouble, Bath, MapPin  } from "lucide-react";





import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

interface Property {
  _id: string
  title: string
  description: string
  type: string
  price?: number
  category: string
  pricePerNight?: number
  location: string
  bedrooms?: number
  bathrooms?: number
  images: string[]
  slug: string
}

/* -------------------- Helpers -------------------- */
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)

const truncate = (text: string, max = 38) =>
  text.length > max ? text.slice(0, max) + '...' : text
/* ------------------------------------------------- */

export default function PropertyCarousel() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  const shuffledProperties = [...properties]
  .sort(() => 0.5 - Math.random())
  .slice(0, 7);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/properties')
        setProperties(res.data)
      } catch (err) {
        console.error('Failed to load properties', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (loading) {
    return (
      <p className="py-10 text-center text-gray-600 dark:text-gray-300">
        Loading properties...
      </p>
    )
  }

  return (
    <div className="relative w-full px-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
         {shuffledProperties.map((property) => (
        <SwiperSlide key={property._id}>
          <Link
        href={`/estate/listings/${property.slug}`}
       
      >
  <div className="cursor-pointer overflow-hidden rounded-xl bg-white shadow transition-transform duration-300 hover:scale-[1.02] dark:bg-gray-800">
    <Image
      src={property.images[0]}
      alt={property.title}
      width={500}
      height={300}
      className="h-60 w-full rounded-t-xl object-cover"
    />

    <div className="space-y-2 p-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {truncate(property.title)}
      </h3>

      <h4 className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
  <MapPin size={16} className="text-red-500" />
  {capitalize(property.location)}
</h4>


      <p className="text-sm text-gray-500 dark:text-gray-400">
        {capitalize(property.category)}
      </p>

    <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
  <span>
    {property.price
      ? `₦${property.price.toLocaleString()}`
      : property.pricePerNight
      ? `₦${property.pricePerNight.toLocaleString()} / Night`
      : "Price on request"}
  </span>

  {(property.bedrooms || property.bathrooms) && (
    <div className="flex items-center gap-3">
      {property.bedrooms && (
        <span className="flex items-center gap-1">
          <BedDouble size={16} />
          {property.bedrooms}
        </span>
      )}

      {property.bedrooms && property.bathrooms && (
        <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
      )}

      {property.bathrooms && (
        <span className="flex items-center gap-1">
          <Bath size={16} />
          {property.bathrooms}
        </span>
      )}
    </div>
  )}
</div>


    </div>
  </div>
  </Link>
</SwiperSlide>
        ))}
      </Swiper>

      {/* ---------------- Modal Preview ---------------- */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                width={1000}
                height={600}
                className="h-64 w-full object-cover"
              />

              <div className="space-y-4 p-6 text-gray-800 dark:text-white">
                <h2 className="text-2xl font-bold">
                  {selectedProperty.title}
                </h2>

                <p className="text-sm">
                  {selectedProperty.description}
                </p>

                <p className="text-sm font-medium">
                  {capitalize(selectedProperty.location)}
                </p>

                <div className="flex justify-between text-sm font-medium">
                  <span>
                    Price:{' '}
                    <strong>
                      {selectedProperty.price
                        ? `₦${selectedProperty.price.toLocaleString()}`
                        : 'On request'}
                    </strong>
                  </span>

                  {selectedProperty.bedrooms && (
                    <span>
                      Bedrooms:{' '}
                      <strong>{selectedProperty.bedrooms}</strong>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute right-4 top-4 text-3xl text-white"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
