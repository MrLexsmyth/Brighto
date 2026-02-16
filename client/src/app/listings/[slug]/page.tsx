"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../utils/axios";
import ShareButton from "../../../../components/Share";
import PropertyMap from "../../../../components/PropertyMap";
import { MapPin, BedDouble, Bath } from "lucide-react";

interface Agent {
  _id: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
  phone?: string;
}

type Property = {
  _id: string;
  title: string;
  description: string;
  price?: number;
  pricePerNight?: number;
  category: string;
  type: string;
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
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  agent: Agent;
};

// Modal Component
function ImageGalleryModal({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-5xl h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
     <div className="w-full h-[500px] sm:h-[600px] flex flex-col">

  <div className=" mb-4">
    
      <ShareButton />

  </div>

  {/* Image */}

  <div className=" relative flex-1">
  <Image
    src={images[currentIndex]}
    alt={`Image ${currentIndex + 1}`}
    fill
    className="object-cover"
    priority={currentIndex === 0}
    sizes="(max-width: 768px) 100vw, 1920px"
  />
</div>

</div>
        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

export default function PublicPropertyPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

 

  const openModal = (index: number) => {
    setModalStartIndex(index);
    setShowModal(true);
  };

  // Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/slug/${slug}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <p className="py-10 text-center text-gray-600 dark:text-gray-300">
        Loading property...
      </p>
    );
  }

  if (!property) {
    return (
      <p className="py-10 text-center text-red-500">Property not found.</p>
    );
  }

  const remainingImages = property.images.length > 5 ? property.images.length - 5 : 0;
  const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};


  <Head>
  <title>{property.title}</title>
  <meta name="description" content={property.description.slice(0, 160)} />
  
  {/* Open Graph */}
  <meta property="og:title" content={property.title} />
  <meta property="og:description" content={property.description.slice(0, 70)} />
  <meta property="og:image" content={property.images[0]} />
  <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
  <meta property="og:type" content="website" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={property.title} />
  <meta name="twitter:description" content={property.description.slice(0, 160)} />
  <meta name="twitter:image" content={property.images[0]} />
</Head>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Title and Location */}
      <div className="grid gap-2 md:flex md:justify-between md:items-start mb-4">
        <div>
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl mb-2">
            {property.title}
          </h1>
          <div className="flex flex-col gap-1">
            <h4 className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={16} className="text-red-500" />
              {property.location.area && `${property.location.area}, `}
              {property.location.city}, {property.location.state}
            </h4>
            <p className="text-xs text-gray-500 ml-5">
              {property.location.address}
            </p>
          </div>
        </div>

        <p className="text-3xl font-bold text-[#004274]">

          ₦{property.price?.toLocaleString() ||
            property.pricePerNight?.toLocaleString() ||
            "On request"}
          {(property.price || property.pricePerNight) && ".00"} 
          
        </p>
        <div className="hidden md:block">
          <ShareButton
          image={property.images[0]}
          title={property.title}
          description={stripHtml(property.description.slice(0, 70))}
  
/>

        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Gallery Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[600px]">
            {/* Large main image - takes 2 columns and 2 rows */}
            <div
              className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openModal(0)}
            >
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Small images - 4 quarter-sized images */}
            {property.images.slice(1, 5).map((image, index) => {
              const isLast = index === 3 && remainingImages > 0;
              return (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openModal(index + 1)}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Show more overlay on last small image */}
                  {isLast && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                      <div className="text-white text-center">
                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-semibold">+{remainingImages}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="block sm:hidden mt-4 mb-4">
        <ShareButton
  title={property.title}
  description={stripHtml(property.description.slice(0, 70))}
  image={property.images[0]}
/>

      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t mb-8 bg-gray-50 rounded-xl">
        {property.bedrooms && (
          <div className="flex items-center gap-3 p-4">
            <BedDouble className="w-6 h-6" />
            <div>
              <p className="text-base text-gray-500">Bedrooms</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {property.bedrooms}
              </p>
            </div>
          </div>
        )}

        {property.bathrooms && (
          <div className="flex items-center gap-3 p-4">
            <Bath className="w-6 h-6" />
            <div>
              <p className="text-base text-gray-500">Bathrooms</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {property.bathrooms}
              </p>
            </div>
          </div>
        )}

        {property.size && (
          <div className="flex items-center gap-3 p-4">
            <svg className="w-6 h-6 text-[#00aeff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <div>
              <p className="text-base text-gray-500">Size</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {property.size}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-4">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="text-base text-gray-500">Type</p>
            <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">
              {property.type}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-base text-gray-500">Category</p>
            <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">
              {property.category}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-gray-200 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <div className="h-px bg-gray-300 mb-8"></div>
            <div
              className="prose prose-lg max-w-none dark:prose-invert text-gray-700 mt-8"
              dangerouslySetInnerHTML={{ __html: property.description || "" }}
            />
          </div>

          {/* MAP SECTION */}
          {property.location.coordinates && (
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-red-500" />
                Location
              </h2>
              <PropertyMap
                lat={property.location.coordinates.lat}
                lng={property.location.coordinates.lng}
                title={property.title}
                address={property.location.address}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Address:</strong> {property.location.address}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Area:</strong>{" "}
                  {property.location.area || "N/A"}, {property.location.city}, {property.location.state}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Price */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 p-6 bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {property.price
                ? "Price"
                : property.pricePerNight
                ? "Price per Night"
                : "Price"}
            </h3>
            <p className="text-3xl font-bold text-[#004274] mb-6">
              ₦{property.price?.toLocaleString() ||
                property.pricePerNight?.toLocaleString() ||
                "On request"}
              {(property.price || property.pricePerNight) && ".00"}
            </p>
<a
            
              href={`https://wa.me/${property.agent.phone?.replace(/\D/g, '')}?text=I'm interested in ${encodeURIComponent(
                property.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#004274] text-white py-3 rounded-lg font-semibold hover:bg-[#003060] transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Inquire Now
            </a>
          </div>
        </div>
      </div>

      {/* Agent Cards - Desktop */}
      <div className="hidden lg:flex lg:flex-col gap-4 w-full lg:w-80 mt-8">
        {/* Card 1 - Agent Contact */}
        <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{property.agent.name}</p>
              <p className="text-sm text-gray-600">{property.agent.title || "Investment Advisor"}</p>
              <p className="text-sm text-gray-600">{property.agent.email || "No email provided"}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${property.agent.phone?.replace(/\D/g, '')}?text=I'm interested in ${encodeURIComponent(
              property.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>

        {/* Card 2 - Target Audience */}
        <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-gradient-to-br from-blue-50 to-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Ideal For
          </h3>
          <ul className="space-y-2">
            {["Families", "Couples", "Business travelers", "Relocation housing", "Luxury lifestyle seekers"].map(
              (item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Agent Cards - Mobile */}
      <div className="lg:hidden flex flex-col gap-4 mb-8 mt-8">
        {/* Card 1 - Agent Contact */}
        <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{property.agent.name}</p>
              <p className="text-sm text-gray-600">{property.agent.title || "Investment Advisor"}</p>
              <p className="text-sm text-gray-600">{property.agent.email}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${property.agent.phone?.replace(/\D/g, '')}?text=I'm interested in ${encodeURIComponent(
              property.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>

        {/* Card 2 - Target Audience */}
        <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-gradient-to-br from-blue-50 to-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Ideal For
          </h3>
          <ul className="space-y-2">
            {["Families", "Couples", "Business travelers", "Relocation housing", "Luxury lifestyle seekers"].map(
              (item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ImageGalleryModal
          images={property.images}
          initialIndex={modalStartIndex}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}