'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SlideshowImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface ImageSlideshowProps {
  images: SlideshowImage[];
  autoScrollInterval?: number;
  onImageClick?: (id: string) => void;
  onImageLoad?: (src: string) => void;
  onImageError?: (src: string) => void;
}

export default function ImageSlideshow({ images, autoScrollInterval = 5000, onImageClick, onImageLoad, onImageError }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto scroll effect
  useEffect(() => {
    if (!isAutoScrolling || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [isAutoScrolling, images.length, autoScrollInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    // Resume auto scrolling after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {/* Main slideshow container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;
          const startY = e.touches[0].clientY;
          
          const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
          };
          
          const handleTouchEnd = (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
              e.preventDefault();
              if (diffX > 0) {
                goToNext();
              } else {
                goToPrevious();
              }
            }
            
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };
          
          document.addEventListener('touchmove', handleTouchMove, { passive: false });
          document.addEventListener('touchend', handleTouchEnd, { passive: false });
        }}
      >
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className={`w-full h-full flex-shrink-0 relative ${onImageClick ? 'cursor-pointer' : ''}`}
            onClick={() => onImageClick?.(image.id)}
          >
            {/* Blurred background */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
              style={{ backgroundImage: `url(${image.src})` }}
            />
            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                priority={index === 0}
                onLoad={() => onImageLoad?.(image.src)}
                onError={() => onImageError?.(image.src)}
              />
            </div>
            {/* Overlay content if needed */}
            {(image.title || image.subtitle) && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0">
                <div className="text-center text-white">
                  {image.title && <h3 className="text-xl font-bold mb-2">{image.title}</h3>}
                  {image.subtitle && <p className="text-sm">{image.subtitle}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows - Desktop only */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10 hover:cursor-pointer"
            aria-label="Previous image"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10 hover:cursor-pointer"
            aria-label="Next image"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full rounded-lg overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
