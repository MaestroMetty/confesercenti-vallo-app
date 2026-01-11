import { getPromotions, getStores } from "@/db/db";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineAdd, MdOutlineEdit, MdOutlineStore } from 'react-icons/md';

//Types imports
import type Promotion from '@/types/Promotion';
import type Store from '@/types/Store';

// Force dynamic rendering - don't prerender at build time (needs database)
export const dynamic = 'force-dynamic';

async function PromotionsList() {
    const [promotions, stores] = await Promise.all([
        getPromotions(),
        getStores()
    ]);

    // Create a map of storeId to store for quick lookup
    const storeMap = new Map<number, Store>();
    stores.forEach(store => storeMap.set(store.id, store));

    // Group promotions by store
    const promotionsByStore = new Map<number, Promotion[]>();
    promotions.forEach(promotion => {
        if (!promotionsByStore.has(promotion.storeId)) {
            promotionsByStore.set(promotion.storeId, []);
        }
        promotionsByStore.get(promotion.storeId)!.push(promotion);
    });

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Promozioni</h2>
                        <Link
                            href="/promotions/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 hover:cursor-pointer"
                        >
                            <MdOutlineAdd className="h-4 w-4 mr-1" />
                            Aggiungi Promozione
                        </Link>
                    </div>
                </div>
                
                {promotions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nessuna promozione trovata</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Array.from(promotionsByStore.entries()).map(([storeId, storePromotions]) => {
                            const store = storeMap.get(storeId);
                            return (
                                <div key={storeId} className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <MdOutlineStore className="h-6 w-6 text-blue-600" />
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {store ? store.name : `Negozio ID: ${storeId}`}
                                                </h3>
                                                {store?.address && (
                                                    <p className="text-sm text-gray-500">{store.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        {store && (
                                            <Link
                                                href={`/stores/${storeId}`}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 hover:cursor-pointer"
                                            >
                                                Vedi Negozio
                                            </Link>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {storePromotions.map((promotion) => (
                                            <div 
                                                key={promotion.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 gap-4"
                                            >
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    {promotion.imageUrl && (
                                                        <div className="flex-shrink-0">
                                                            <Image 
                                                                src={promotion.imageUrl} 
                                                                alt={promotion.name} 
                                                                width={80} 
                                                                height={80}
                                                                className="rounded-lg object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {promotion.name}
                                                        </h4>
                                                        {promotion.endDate && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Scade: {promotion.endDate.toISOString().split('T')[0]}
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
}

export default function PromotionsPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <PromotionsList />
        </Suspense>
    );
}