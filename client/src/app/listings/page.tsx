'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '../../../utils/axios'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, MapPin, Bed, Home, Ruler, Bath } from 'lucide-react'



interface Property {
  _id: string
  title: string
  description: string
  type: string
  price?: number
  size?: string;
  pricePerNight?: number
  category: string
 location: {
    address: string;
    city: string;
    state: string;
    area?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  bedrooms?: number
   bathrooms?: number;
  images: string[]
  slug: string
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties')
        setProperties(res.data)
      } catch (err) {
        console.error('Failed to load properties', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) 
   
  )

  if (loading) {
    return (
      <div className=" mt-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#192839] to-[#2a3f5f] dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
        
         
                <h1 className="mb-4 text-4xl font-bold sm:text-4xl lg:text-5xl text-gray-300">
                  Explore premium properties across Nigeria
                </h1>
              
          

            {/* Search Bar */}
   <div className="mx-auto max-w-3xl">
  <div className="relative">
    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
      <Search className="h-5 w-5 text-white" />
    </div>
    <input
      type="text"
      placeholder="Search by location, title, or property type..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full rounded-full bg-white py-6 pl-20 pr-6 text-gray-900 text-lg shadow-2xl outline-none transition-all border-2 border-gray-100 focus:border-red-500 focus:shadow-red-500/20 hover:border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 placeholder:text-gray-400"
    />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm('')}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    )}
  </div>
</div>
          </motion.div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Filter Bar */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredProperties.length}
            </span>{' '}
            {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
            <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800"
              >
                <Link href={`/listings/${property.slug}`} className="block">
                  {/* Image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={property.images?.[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 4}
                    />
                    {/* Category Badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                      {capitalize(property.category)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h2 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 dark:text-white">
                      {property.title}
                    </h2>

                    {/* Location */}
                    <div className="mb-3 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{(property.location.area || property.location.address)}</span>
                    </div>
                    <div className='flex gap-4'>
                         {/* Bedrooms (if available) */}
                    {property.bedrooms && (
                      <div className="mb-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                       {property.bedrooms} <Bed className="h-4 w-4" />
                       
                      </div>
                    )}
                      {/* Bathrooms (if available) */}
                      {property.bathrooms && (
                        <div className="mb-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                         {property.bathrooms} <Bath className="h-4 w-4" />
                         
                        </div>
                      )}
                    </div>
                 

                    {/* Size (if available) */}
                    {property.size && (
                      <div className="mb-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Ruler className="h-4 w-4" />
                        <span>{property.size}m²</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                      <p className="text-xl font-bold text-red-600">
                        {property.price
                          ? `₦${property.price.toLocaleString()}`
                          : property.pricePerNight
                          ? `₦${property.pricePerNight.toLocaleString()}`
                          : 'Contact'}
                      </p>
                      {property.pricePerNight && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          / night
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}