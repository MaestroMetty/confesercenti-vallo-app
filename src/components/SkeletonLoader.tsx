export default function SkeletonLoader() {
  return (
    <div className="w-full h-64 bg-gray-300 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
    </div>
  );
}

export function StoreSkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex h-32">
            {/* Left side - Store info skeleton */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="space-y-2">
                  {/* Store name skeleton */}
                  <div className="h-6 bg-gray-300 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                  </div>
                  {/* Address skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                  </div>
                </div>
              </div>
              
              {/* Button skeleton */}
              <div className="h-8 w-20 bg-gray-300 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
              </div>
            </div>
            
            {/* Right side - Store image skeleton */}
            <div className="w-36 h-full flex-shrink-0">
              <div className="w-full h-full bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
