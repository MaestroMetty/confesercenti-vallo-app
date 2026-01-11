'use client';

import { useState } from 'react';
import StoreList from '@/components/Store/StoreList';
import PromotionSlideshow from '@/components/PromotionSlideshow';
import SkeletonLoader, { StoreSkeletonLoader } from '@/components/SkeletonLoader';

interface MainPageContentProps {
  stores: any[];
  promotions: any[];
}

export default function MainPageContent({ stores, promotions }: MainPageContentProps) {
  const [promotionImagesLoaded, setPromotionImagesLoaded] = useState(false);
  const [storeImagesLoaded, setStoreImagesLoaded] = useState(false);

  // Check if all images are loaded
  const allImagesLoaded = promotionImagesLoaded && storeImagesLoaded;
  const showSkeleton = !allImagesLoaded;

  const handlePromotionImagesLoaded = () => {
    setPromotionImagesLoaded(true);
  };

  const handleStoreImagesLoaded = () => {
    setStoreImagesLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop container with margins */}
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header Section with Dark Green Background */}
        <div className="bg-green-800 relative overflow-hidden">
          {/* Curved white shape overlay */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5"></div>
          
          <div className="relative z-10 px-4 py-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-6">In Primo Piano</h1>
            
            {/* Promotions Slideshow */}
            <div className="mx-auto max-w-md">
              {showSkeleton ? (
                <SkeletonLoader />
              ) : (
                <PromotionSlideshow 
                  promotions={promotions} 
                  onImagesLoaded={handlePromotionImagesLoaded}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 py-6 pb-20">
          {showSkeleton ? (
            <StoreSkeletonLoader />
          ) : (
            <StoreList 
              stores={stores} 
              onImagesLoaded={handleStoreImagesLoaded}
            />
          )}
        </div>
      </div>
    </div>
  );
}
