'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { createPromotion } from '@/lib/ServerActions/PromotionActions';
import { getAllStores } from '@/lib/ServerActions/StoreActions';
import { useRouter } from 'next/navigation';
import { MdOutlineImage, MdOutlineArrowBack, MdOutlineSave } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import ImageSelectionModal from '@/components/Image/ImageSelectionModal';

//Types imports
import type Store from '@/types/Store';
import type ImageType from '@/types/Image';

export default function CreatePromotionPage() {
    const router = useRouter();

    const [stores, setStores] = useState<Store[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllStores().then((result) => {
            if (result && result.success && result.stores.length > 0) {
                setStores(result.stores);
            } else {
                setError('Errore durante la ricerca dei negozi');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const result = await createPromotion(formData);
        if (result && !result.success) {
            toast.error(result.error || 'Errore durante la creazione della promozione');
            setError(result.error || 'Errore durante la creazione della promozione');
            setIsSubmitting(false);
        }
        if (result && result.success) {
            toast.success('Promozione creata con successo');
            setError(null);
            router.push('/promotions');
        }
    }

    const handleImageSelect = (imageId: number, image: ImageType) => {
        setSelectedImageId(imageId);
        setSelectedImageUrl(image.url);
        setIsModalOpen(false);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !stores.length) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
                    <p className="text-red-600 text-center">{error}</p>
                    <Link 
                        href="/promotions"
                        className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                        <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                        Torna alle Promozioni
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Crea Nuova Promozione</h2>
                        <Link
                            href="/promotions"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                        >
                            <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                            Indietro
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Promozione *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Inserisci il nome della promozione"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-2">
                                Negozio *
                            </label>
                            <select
                                id="storeId"
                                name="storeId"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Descrivi la promozione..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Inizio
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Fine
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Immagine Promozione
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <input
                                    type="hidden"
                                    name="imageUrl"
                                    value={selectedImageUrl || ''}
                                />
                                
                                {selectedImageUrl && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={selectedImageUrl}
                                            alt="Immagine selezionata"
                                            width={100}
                                            height={100}
                                            className="rounded-lg object-cover border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                                >
                                    <MdOutlineImage className="h-4 w-4 mr-2" />
                                    {selectedImageUrl ? 'Cambia Immagine' : 'Seleziona Immagine'}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creazione in corso...
                                    </>
                                ) : (
                                    <>
                                        <MdOutlineSave className="h-5 w-5 mr-2" />
                                        Crea Promozione
                                    </>
                                )}
                            </button>
                            
                            <Link
                                href="/promotions"
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                            >
                                Annulla
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <ImageSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleImageSelect}
                selectedImageId={selectedImageId}
            />
        </div>
    );
}