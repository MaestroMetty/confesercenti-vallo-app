'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlinePhoto, MdOutlineVisibility } from 'react-icons/md';

//Functions imports
import { getImages } from "@/lib/ServerActions/ImageActions";

//Components imports
import CleanUnusedImages from "@/components/Image/CleanUnusedImages";
import DiskUsage from "@/components/Image/DiskUsage";

//Types imports
import type ImageType from '@/types/Image';

export default function ImagesPage() {
    const [images, setImages] = useState<ImageType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            const result = await getImages();
            if (!result.success) {
                setError(result.error || 'Errore durante il caricamento delle immagini');
            } else {
                setImages(result.images || []);
                setError(null);
            }
            setIsLoading(false);
        };

        fetchImages();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center py-12">
                            <p className="text-red-600 text-lg">Errore: {error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between gap-2 mb-6">
                        <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-2">
                                <MdOutlinePhoto className="h-8 w-8 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Gestione Immagini</h2>
                            </div>
                            <CleanUnusedImages />
                        </div>
                    </div>
                    
                    <DiskUsage />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Libreria Immagini</h3>
                    
                    {images && images.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <MdOutlinePhoto className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-gray-500 text-lg">Nessuna immagine trovata</p>
                            <p className="text-gray-400 text-sm mt-1">Le immagini caricate verranno visualizzate qui</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images && images.map((image: ImageType) => (
                                <Link 
                                    key={image.id} 
                                    href={`/images/${image.id}`}
                                    className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all duration-150"
                                >
                                    {image.url && (
                                        <Image 
                                            src={image.url} 
                                            alt={`Immagine ${image.id}`} 
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-150"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-150 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <div className="bg-white rounded-full p-2">
                                                <MdOutlineVisibility className="h-6 w-6 text-gray-900" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}