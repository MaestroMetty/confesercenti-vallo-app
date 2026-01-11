'use client';

import { toast } from 'sonner';
import { createStore } from '@/lib/ServerActions/StoreActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineImage, MdOutlineArrowBack, MdOutlineSave } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import ImageSelectionModal from '@/components/Image/ImageSelectionModal';
import type ImageType from '@/types/Image';

export default function CreateStorePage() {
    const router = useRouter();

    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const result = await createStore(formData);
        if (result && !result.success) {
            toast.error(result.error || 'Errore durante la creazione del negozio');
            setIsSubmitting(false);
            router.refresh();
        }
        if (result && result.success) {
            toast.success('Negozio creato con successo');
            router.push('/stores');
        }
    }

    const handleImageSelect = (imageId: number, image: ImageType) => {
        setSelectedImageId(imageId);
        setSelectedImageUrl(image.url);
        setIsModalOpen(false);
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Crea Nuovo Negozio</h2>
                        <Link
                            href="/stores"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                        >
                            <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                            Indietro
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Negozio *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Inserisci il nome del negozio"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Indirizzo
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Via, Città, CAP"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                Città
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                placeholder="Es: Roma"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                                Provincia
                            </label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                placeholder="Es: RM"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                CAP
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder="Es: 00100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="+39 123 456 7890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="negozio@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                Sito Web
                            </label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                placeholder="https://www.example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                placeholder="Es: Abbigliamento, Elettronica, Alimentari..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Inserisci una descrizione del negozio..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Immagine Negozio
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
                                        Crea Negozio
                                    </>
                                )}
                            </button>
                            
                            <Link
                                href="/stores"
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