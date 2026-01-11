'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PromotionModalProps {
    promotion: {
        id: number;
        name: string;
        description: string | null;
        imageUrl: string | null;
        startDate: Date | null;
        endDate: Date | null;
        storeId: number;
    };
    onClose: () => void;
    showStoreButton?: boolean;
}

export default function PromotionModal({ promotion, onClose, showStoreButton = false }: PromotionModalProps) {
    const formatDate = (date: Date | null) => {
        if (!date) return 'Non specificata';
        return new Date(date).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Dettagli Promozione</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Promotion Image */}
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
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
                                        fill
                                        className="object-contain"
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

                    {/* Promotion Details */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{promotion.name}</h3>
                            {promotion.description && (
                                <p className="text-gray-600">{promotion.description}</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Data Inizio</p>
                                <p className="text-gray-900">{formatDate(promotion.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Data Fine</p>
                                <p className="text-gray-900">{formatDate(promotion.endDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Store Button */}
                    {showStoreButton && (
                        <div className="pt-4 border-t">
                            <Link href={`/store/${promotion.storeId}`}>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-green-800 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Vai al negozio
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
