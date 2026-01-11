'use client';

import Link from 'next/link';
import { MdOutlinePhoto, MdOutlineStore, MdOutlineLocalOffer } from 'react-icons/md';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/stores"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 group"
            >
              <MdOutlineStore className="h-16 w-16 text-blue-600 group-hover:text-blue-700 mb-4" />
              <span className="text-xl font-medium text-gray-900 text-center">Negozi</span>
            </Link>

            <Link 
              href="/promotions"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 group"
            >
              <MdOutlineLocalOffer className="h-16 w-16 text-blue-600 group-hover:text-blue-700 mb-4" />
              <span className="text-xl font-medium text-gray-900 text-center">Promozioni</span>
            </Link>
            
            <Link 
              href="/images"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150 group"
            >
              <MdOutlinePhoto className="h-16 w-16 text-blue-600 group-hover:text-blue-700 mb-4" />
              <span className="text-xl font-medium text-gray-900 text-center">Immagini</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}