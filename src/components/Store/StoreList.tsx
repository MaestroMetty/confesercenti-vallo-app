'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type Store from '@/types/Store';
import Image from "next/image";
import Link from 'next/link';
import { createProvinceMap, filterStores } from '@/lib/SearchActions/SearchActions';
import { useGeolocation } from '@/lib/useGeolocation';

interface StoreListProps {
    stores: Store[];
    onImagesLoaded?: () => void;
}

function AutoScrollText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [scrollDistance, setScrollDistance] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.scrollWidth;
                const needsScroll = textWidth > containerWidth;
                setShouldScroll(needsScroll);
                if (needsScroll) {
                    const distance = textWidth - containerWidth;
                    setScrollDistance(distance);
                    textRef.current.style.setProperty('--scroll-distance', `${distance}px`);
                } else {
                    textRef.current.style.removeProperty('--scroll-distance');
                }
            }
        };

        // Use requestAnimationFrame to ensure DOM is ready
        const rafId = requestAnimationFrame(() => {
            checkOverflow();
            // Also check after a short delay to catch any layout changes
            setTimeout(checkOverflow, 200);
        });

        window.addEventListener('resize', checkOverflow);
        
        // Use ResizeObserver if available for better detection
        let resizeObserver: ResizeObserver | null = null;
        if (containerRef.current && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(checkOverflow);
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', checkOverflow);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [children]);

    return (
        <div ref={containerRef} className={`overflow-hidden max-w-full ${className}`}>
            <span 
                ref={textRef} 
                className={`inline-block whitespace-nowrap ${shouldScroll ? 'text-auto-scroll' : ''}`}
            >
                {children}
            </span>
        </div>
    );
}

export default function StoreList({ stores, onImagesLoaded }: StoreListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    // Geolocation hook
    const {
        userPostalCode,
        isLoading: isLocationLoading,
        error: locationError,
        isEnabled: isLocationEnabled,
        getCurrentLocation,
        disableLocation,
    } = useGeolocation();

    // Create a single map of province sigla and nome to province data for quick lookup
    const provinceMap = useMemo(() => createProvinceMap(), []);

    // Get unique categories from stores as a Map (one per type)
    const categories = useMemo(() => {
        const categoryMap = new Map<string, string>();
        stores.forEach(store => {
            if (store.category) {
                categoryMap.set(store.category, store.category);
            }
        });
        return categoryMap;
    }, [stores]);

    // Filter stores based on search term, category, and location
    const filteredStores = useMemo(() => {
        const postalCodeForFilter = isLocationEnabled && userPostalCode ? userPostalCode : null;
        return filterStores(stores, searchTerm, selectedCategory, provinceMap, postalCodeForFilter);
    }, [stores, searchTerm, selectedCategory, provinceMap, isLocationEnabled, userPostalCode]);

    if (stores.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Nessun negozio trovato</p>
            </div>
        );
    }

    
    return (
        <div className="space-y-4 mb-10">
            {/* Filter and Search Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 position-sticky top-0">
                {/* Error message for location */}
                {locationError && (
                    <div className="mb-3 text-xs text-red-600">
                        {locationError}
                    </div>
                )}

                {/* Search and Filter Row */}
                <div className="flex items-center gap-2 min-w-0">
                    {/* Search Icon and Input */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Expandable Search Input */}
                        <div className={`transition-all duration-300 ease-in-out ${
                            isSearchOpen ? 'w-[85%] ml-3 opacity-100' : 'w-0 ml-0 opacity-0'
                        }`}>
                            <input
                                type="text"
                                placeholder="Cerca per nome, provincia, città o CAP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category Filter Buttons - only show when search is collapsed */}
                    {!isSearchOpen && (
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <div className={`transition-all duration-300 ease-in-out ${
                                isCategoriesExpanded 
                                    ? 'grid grid-cols-2 gap-2 max-h-48 overflow-y-auto' 
                                    : 'flex flex-row gap-1 overflow-x-scroll pb-2 min-w-0'
                            } ${
                                isCategoriesExpanded 
                                    ? '[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300' 
                                    : '[&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 lg:[&::-webkit-scrollbar]:h-[2px]'
                            }`}>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        isCategoriesExpanded ? 'w-full text-center whitespace-normal break-words' : 'whitespace-nowrap'
                                    } ${
                                        selectedCategory === null
                                            ? 'bg-green-800 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Tutti
                                </button>
                                {Array.from(categories.values()).sort().map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            isCategoriesExpanded ? 'w-full text-center whitespace-normal break-words' : 'whitespace-nowrap'
                                        } ${
                                            selectedCategory === category
                                                ? 'bg-green-800 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {category ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() : category}
                                    </button>
                                ))}
                            </div>
                            {/* Expand/Collapse Button and Location Button */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                    className="flex items-center justify-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    {isCategoriesExpanded ? (
                                        <>
                                            <span>Mostra meno</span>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <span>Mostra tutte le categorie</span>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        if (isLocationEnabled) {
                                            disableLocation();
                                        } else {
                                            getCurrentLocation();
                                        }
                                    }}
                                    disabled={isLocationLoading}
                                    className={`flex items-center justify-center gap-1 text-xs transition-colors ${
                                        isLocationEnabled
                                            ? 'text-green-800 hover:text-green-900'
                                            : 'text-gray-600 hover:text-gray-800'
                                    } ${isLocationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={isLocationEnabled ? 'Disattiva filtro posizione' : 'Filtra negozi nella tua zona'}
                                >
                                    {isLocationLoading ? (
                                        <>
                                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Caricamento...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Vicini a me</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Clear Filters Button - show when any filter is active */}
                    {(searchTerm || selectedCategory || isLocationEnabled) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory(null);
                                setIsSearchOpen(false);
                                disableLocation();
                            }}
                            className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ml-auto transform -translate-y-3"
                            title="Cancella filtri"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Results count - only show when filtering */}
                {(searchTerm || selectedCategory || isLocationEnabled) && (
                    <div className="mt-3 text-sm text-gray-600">
                        {filteredStores.length} negozi trovati
                        {searchTerm && ` per "${searchTerm.trim()}"`}
                        {selectedCategory && ` in categoria "${selectedCategory}"`}
                        {isLocationEnabled && userPostalCode && ` nel CAP ${userPostalCode}`}
                    </div>
                )}
            </div>

            {/* Store List */}
            {filteredStores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Nessun negozio trovato con i filtri selezionati</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredStores.map((store: Store) => (
                      <Link href={`/store/${store.id}`} key={store.id}>
                        <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:cursor-pointer mb-4">
                            <div className="flex h-32">
                                {/* Left side - Store info */}
                                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                                    <div className="min-w-0">
                                        <AutoScrollText className="font-semibold text-gray-900 text-xs mb-2">
                                            {store.name}
                                        </AutoScrollText>
                                        
                                        <div className="flex items-center text-gray-600 text-xs mb-3 min-w-0">
                                            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <AutoScrollText>
                                                    {store.city ? store.city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' ' + store.province : store.address || 'Nessun indirizzo'}
                                                </AutoScrollText>
                                            </div>
                                        </div>
                                    </div>
                                    
                                        <button className="bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center w-fit hover:cursor-pointer">
                                            Offerte
                                            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                </div>
                                
                                {/* Right side - Store image */}
                                <div className="w-36 min-w-[5rem] h-full shrink rounded-2xl relative overflow-hidden p-1">
                                    {store.imageUrl ? (
                                        <>
                                            {/* Blurred background */}
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
                                                style={{ backgroundImage: `url(${store.imageUrl})` }}
                                            />
                                            {/* Main image */}
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <Image 
                                                    src={store.imageUrl} 
                                                    alt={store.name} 
                                                    width={144} 
                                                    height={128}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                    ))}
                </div>
            )}
        </div>
    )
}