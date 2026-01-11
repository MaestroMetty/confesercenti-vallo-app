'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdMenu, MdClose, MdOutlineHome, MdOutlinePhoto, MdOutlineLogout, MdOutlineStore, MdOutlineLocalOffer } from "react-icons/md";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {    
    router.push("/logout");  
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-4 text-gray-600 hover:text-gray-900"
        >
          {isMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}>
        <div className="pt-16 px-4 space-y-4">
          <Link href="/dashboard" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
            <MdOutlineHome className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link href="/stores" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
            <MdOutlineStore className="w-5 h-5 mr-2" />
            Negozi
          </Link>
          <Link href="/promotions" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
            <MdOutlineLocalOffer className="w-5 h-5 mr-2" />
            Promozioni
          </Link>
          <Link href="/images" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
            <MdOutlinePhoto className="w-5 h-5 mr-2" />
            Immagini
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-2 text-red-600 hover:text-red-700"
          >
            <MdOutlineLogout className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white shadow-sm z-50 shadow-gray-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 max-w-7xl mx-auto">
            <div className="flex items-center pl-8">
              <div className="flex space-x-8">
                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  <MdOutlineHome className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link href="/stores" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  <MdOutlineStore className="w-5 h-5 mr-2" />
                  Negozi
                </Link>
                <Link href="/promotions" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  <MdOutlineLocalOffer className="w-5 h-5 mr-2" />
                  Promozioni
                </Link>
                <Link href="/images" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  <MdOutlinePhoto className="w-5 h-5 mr-2" />
                  Immagini
                </Link>
              </div>
            </div>
            <div className="flex items-center pr-8">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}