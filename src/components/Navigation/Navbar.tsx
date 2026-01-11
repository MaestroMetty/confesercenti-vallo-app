'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg border-t border-gray-200 h-min">
      <div className="flex items-center justify-around px-4 py-1 mb-1">
        {/* Home Button */}
        <button 
          onClick={() => router.push('/')}
          className="flex flex-col items-center space-y-0.5 p-0.5 relative"
        >
          <div className="relative">
            <svg className={`w-7 h-7 ${isActive('/') ? 'text-green-800' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {isActive('/') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-800 rounded-full"></div>
            )}
          </div>
        </button>

        {/* Card Button - Central prominent button */}
        <button 
          onClick={() => router.push('/card')}
          className="flex flex-col items-center space-y-0.5 relative mx-2"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform -translate-y-4 mb-0 pb-0 ${
            isActive('/card') ? 'bg-green-800' : 'bg-green-800'
          }`}>
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className={`text-xs mt-[-10px] ${isActive('/card') ? 'text-green-800 font-bold' : 'font-medium text-gray-600'}`}>Fidelity</span>
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => router.push('/settings')}
          className="flex flex-col items-center space-y-0.5 p-0.5 relative"
        >
          <div className="relative">
            <svg className={`w-7 h-7 ${isActive('/settings') ? 'text-green-800' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {isActive('/settings') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-800 rounded-full"></div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

