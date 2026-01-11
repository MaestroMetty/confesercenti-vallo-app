'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type Promotion from '@/types/Promotion';
import { getPromotionsByStoreId } from '@/lib/ServerActions/PromotionActions';
import { getPromotionById } from '@/lib/ServerActions/PromotionActions';
import PromotionModal from '@/components/Promotions/PromotionModal';

//Types imports
import type Store from '@/types/Store';

export default function StoreDetail({ store }: { store: Store }) {
    
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromotions, setLoadingPromotions] = useState(true);
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const result = await getPromotionsByStoreId(store.id);
                if (result.success && result.promotions) {
                    setPromotions(result.promotions);
                }
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoadingPromotions(false);
            }
        };

        fetchPromotions();
    }, [store.id]);

    // Filter only active promotions (not expired)
    const activePromotions = promotions.filter(promo => {
        if (!promo.endDate) return true; // No end date means always active
        return new Date(promo.endDate) > new Date();
    });

    const handlePromotionClick = async (promotionId: number) => {
        const result = await getPromotionById(promotionId);
        if (result.success && result.promotion) {
            setSelectedPromotion(result.promotion);
        }
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Store Info Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                    {store.imageUrl ? (
                        <>
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gray-300 z-10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                                </div>
                            )}
                            {/* Blurred background */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
                                style={{ backgroundImage: `url(${store.imageUrl})` }}
                            />
                            {/* Main image */}
                            <div className="relative w-full h-full flex items-center justify-center z-0">
                                <Image
                                    src={store.imageUrl}
                                    alt={store.name}
                                    fill
                                    onLoad={() => setImageLoaded(true)}
                                    className={imageLoaded ? "object-contain" : "object-contain opacity-0"}
                                    priority={false}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h1>
                        {store.category && (
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {store.category ? store.category.charAt(0).toUpperCase() + store.category.slice(1).toLowerCase() : store.category}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {store.description && (
                        <div className="pt-2">
                            <p className="text-gray-700 leading-relaxed">
                                {store.description ? store.description.charAt(0).toUpperCase() + store.description.slice(1) : store.description}
                                </p>
                        </div>
                    )}

                    {/* Store Details */}
                    <div className="space-y-2">
                        {store.address && (
                            <div className="flex items-start text-gray-600">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{
                                    store.city ?
                                        store.address + ', ' + store.city?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ', ' + store.province?.toUpperCase() + ' - ' + store.postalCode
                                    : store.address
                                }</span>
                            </div>
                        )}
                        
                        {store.phone && (
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span>{store.phone}</span>
                            </div>
                        )}
                        
                        {store.email && (
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>{store.email}</span>
                            </div>
                        )}
                        
                        {store.website && (
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline">
                                    {store.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Promotions Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Promozioni Attive</h2>
                
                {loadingPromotions ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                                <div className="flex h-32">
                                    <div className="w-36 h-full flex-shrink-0 p-1">
                                        <div className="w-full h-full bg-gray-300 rounded-lg relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                                        </div>
                                    </div>
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
                ) : activePromotions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <p>Nessuna promozione attiva al momento</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activePromotions.map((promotion) => (
                            <div 
                                key={promotion.id} 
                                onClick={() => handlePromotionClick(promotion.id)}
                                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex h-32">
                                    {/* Promotion Image */}
                                    <div className="w-36 h-full flex-shrink-0 rounded-2xl relative overflow-hidden p-1">
                                        {promotion.imageUrl ? (
                                            <>
                                                {/* Blurred background */}
                                                <div 
                                                    className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
                                                    style={{ backgroundImage: `url(${promotion.imageUrl})` }}
                                                />
                                                {/* Main image */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <Image 
                                                        src={promotion.imageUrl} 
                                                        alt={promotion.name} 
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
                                    
                                    {/* Promotion Info */}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                {promotion.name}
                                            </h3>
                                            {promotion.description && (
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {promotion.description}
                                                </p>
                                            )}
                                            {promotion.endDate && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Valida fino al {new Date(promotion.endDate).toLocaleDateString('it-IT')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedPromotion && (
                <PromotionModal
                    promotion={selectedPromotion}
                    onClose={() => setSelectedPromotion(null)}
                    showStoreButton={false}
                />
            )}
        </div>
    );
}
