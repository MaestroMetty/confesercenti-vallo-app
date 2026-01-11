import { getStores } from "@/db/db";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineAdd, MdOutlineEdit } from 'react-icons/md';

//Types imports
import type Store from '@/types/Store';

// Force dynamic rendering - don't prerender at build time (needs database)
export const dynamic = 'force-dynamic';

async function StoresList() {
    const stores: Store[] = await getStores();
    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Negozi</h2>
                        <Link
                            href="/stores/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
                        >
                            <MdOutlineAdd className="h-4 w-4 mr-1" />
                            Aggiungi Negozio
                        </Link>
                    </div>
                    
                    {stores.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nessun negozio trovato</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stores.map((store) => (
                                <div 
                                    key={store.id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 gap-4"
                                >
                                    <div className="flex items-center flex-row justify-start gap-4 w-full sm:w-auto min-w-0">
                                        {store.imageUrl && (
                                            <div className="flex-shrink-0">
                                                <Image 
                                                    src={store.imageUrl} 
                                                    alt={store.name} 
                                                    width={80} 
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 flex flex-row gap-2 min-w-0 overflow-x-auto">
                                            <h3 className="text-lg font-medium text-gray-900 whitespace-nowrap flex-shrink-0">
                                                {store.name}
                                            </h3>
                                            <h3 className="text-lg text-gray-500 whitespace-nowrap flex-shrink-0">
                                                {store.address}
                                            </h3>
                                            <h3 className="text-lg text-gray-500 whitespace-nowrap flex-shrink-0">
                                                {store.category}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Link
                                            href={`/stores/${store.id}`}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
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
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
}

export default function StoresPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <StoresList />
        </Suspense>
    );
}