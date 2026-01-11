import { Suspense } from 'react';
import Link from 'next/link';
import { getStoreById } from '@/db/db';
import StoreDetail from '@/components/Store/StoreDetail';
import SkeletonLoader from '@/components/SkeletonLoader';
import { notFound } from 'next/navigation';

// Force dynamic rendering - don't prerender at build time (needs database)
export const dynamic = 'force-dynamic';

async function StoreDetailWrapper({ storeId }: { storeId: number }) {
  const store = await getStoreById(storeId);
  
  if (!store) {
    notFound();
  }
  
  return <StoreDetail store={store} />;
}

interface PageProps {
  params: Promise<{ storeId: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;
  const id = parseInt(storeId);

  if (isNaN(id)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header with Back Button */}
        <div className="bg-green-800 relative overflow-hidden">
          {/* Curved white shape overlay */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5"></div>
          
          <div className="relative z-10 px-4 py-6">
            {/* Back Button */}
            <Link 
              href="/"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Torna alla home
            </Link>
            
            <h1 className="text-2xl font-bold text-white">Dettagli Negozio</h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 py-6 pb-20">
          <Suspense fallback={
            <div className="space-y-4">
              {/* Main image skeleton (grey shimmering) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 w-full">
                  <SkeletonLoader />
                </div>
              </div>
              {/* Promotions list skeleton styled like promotion items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 w-44 bg-gray-300 rounded mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="flex h-32">
                        {/* Left: promotion image skeleton */}
                        <div className="w-36 h-full flex-shrink-0 p-1">
                          <div className="w-full h-full bg-gray-300 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                          </div>
                        </div>
                        {/* Right: text skeletons */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-5 w-1/2 bg-gray-300 rounded relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                            </div>
                            <div className="h-4 w-4/5 bg-gray-300 rounded relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                            </div>
                            <div className="h-4 w-3/5 bg-gray-300 rounded relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                            </div>
                          </div>
                          <div className="h-3 w-40 bg-gray-200 rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <StoreDetailWrapper storeId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
