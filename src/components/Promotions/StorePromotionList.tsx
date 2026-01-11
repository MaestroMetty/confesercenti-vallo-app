'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineEdit, MdOutlineAdd, MdOutlineLocalOffer } from 'react-icons/md';

//Functions imports
import { getPromotionsByStoreId } from '@/lib/ServerActions/PromotionActions';

//Types imports
import type Promotion from "@/types/Promotion";

export default function StorePromotionList({ storeId }: { storeId: number }) {
    const [promotions, setPromotions] = useState<Promotion[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            setLoading(true);
            const result = await getPromotionsByStoreId(storeId);
            if (!result.success) {
                setError(result.error || 'Errore durante la ricerca delle promozioni');
            } else {
                setPromotions(result.promotions || []);
            }
            setLoading(false);
        };

        fetchPromotions();
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <MdOutlineLocalOffer className="h-6 w-6 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-900">Promozioni del Negozio</h3>
                </div>
            </div>

            {promotions && promotions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MdOutlineLocalOffer className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-lg">Nessuna promozione trovata</p>
                    <p className="text-gray-400 text-sm mt-1">Inizia creando la tua prima promozione</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {promotions && promotions.map((promotion: Promotion) => (
                        <div 
                            key={promotion.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 gap-4"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {promotion.imageUrl && (
                                    <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden">
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
                                                width={80} 
                                                height={80}
                                                className="rounded-lg object-contain max-w-full max-h-full"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {promotion.name}
                                    </h4>
                                    {promotion.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {promotion.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Link
                                    href={`/promotions/${promotion.id}`}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 hover:cursor-pointer"
                                >
                                    <MdOutlineEdit className="h-4 w-4 mr-1" />
                                    Modifica
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}