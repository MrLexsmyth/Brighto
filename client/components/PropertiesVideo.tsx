'use client';
import Image from "next/image";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const propertyVideos = [
  {
    name: 'Modern Duplex in Ajah',
    youtubeId: 'OgLCf70k2ow',
  },
  {
    name: 'Luxury Apartment in Ikoyi',
    youtubeId: 'KCwnWuxtOes',
  },
  {
    name: 'Affordable Bungalow in Ibadan',
    youtubeId: 'ey83oojk2NM',
  },
];

export default function PropertyVideoGallery() {
  const [current, setCurrent] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<null | typeof propertyVideos[0]>(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % propertyVideos.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? propertyVideos.length - 1 : prev - 1));
  };

  const currentVideo = propertyVideos[current];

  const closeModal = () => setSelectedVideo(null);

    const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true, // Also enables drag on desktop
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-800 dark:text-white mb-6 sm:mb-8 md:mb-10">
  Property Video Tours
</h2>

<div {...swipeHandlers}>
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg cursor-pointer"
        onClick={() => setSelectedVideo(currentVideo)}
      >
        <Image
          src={`https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`}
          alt={currentVideo.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-4xl">
          ▶
        </div>
      </div>
</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {currentVideo.name}
      </h3>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          ⬅ Previous
        </button>
        <button
          onClick={next}
          className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Next ➡
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-3xl w-full relative"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-white dark:text-gray-300 hover:text-blue-500 text-xl"
              >
                ✕
              </button>

              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {selectedVideo.name}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
