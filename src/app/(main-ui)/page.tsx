import { Suspense } from 'react';
import { getStores, getPromotions } from '@/db/db';

//Components import
import StoreList from '@/components/Store/StoreList';
import PromotionSlideshow from '@/components/PromotionSlideshow';
import Navbar from '@/components/Navigation/Navbar';
import SkeletonLoader, { StoreSkeletonLoader } from '@/components/SkeletonLoader';

// Force dynamic rendering - don't prerender at build time (needs database)
export const dynamic = 'force-dynamic';

async function StoreListWrapper() {
  const stores = await getStores();
  return <StoreList stores={stores} />;
}

async function PromotionSlideshowWrapper() {
  const promotions = await getPromotions();
  return <PromotionSlideshow promotions={promotions} />;
}

export default function Home() {
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
              <Suspense fallback={<SkeletonLoader />}>
                <PromotionSlideshowWrapper />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 py-6 pb-20">
          <Suspense fallback={<StoreSkeletonLoader />}>
            <StoreListWrapper />
          </Suspense>
        </div>

        {/* Bottom Navigation */}
        <Navbar />
      </div>
    </div>
  )
}