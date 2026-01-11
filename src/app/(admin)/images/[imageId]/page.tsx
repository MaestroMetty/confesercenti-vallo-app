'use client';

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdOutlineArrowBack, MdOutlineDelete, MdOutlineWarning, MdOutlineCheckCircle, MdOutlineStore, MdOutlineLocalOffer } from 'react-icons/md';
import Link from 'next/link';

//Functions Import
import { deleteImage, getImageById, isImageInUse } from "@/lib/ServerActions/ImageActions";

//Types Import
import type ImageType from '@/types/Image';

export default function ImagePage({ params }: { params: Promise<{ imageId: string }> }) {

    const router = useRouter();

    const { imageId } = use(params);
    const [image, setImage] = useState<ImageType | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInUse, setIsInUse] = useState<{inUse: boolean, storeCount: number, promotionCount: number} | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (image) {
            setIsDeleting(true);
            deleteImage(image.id, image.url).then((result) => {
                if (result && result.success) {
                    toast.success('Immagine eliminata con successo');
                    router.push('/images');
                }
                else {
                    toast.error(result.error || 'Errore durante la cancellazione dell\'immagine');
                    setIsDeleting(false);
                }
            });
        }
    }

    useEffect(() => {
        const id = parseInt(imageId);
        if (id) {
            getImageById(id).then((result) => {
                if (result && result.success) {
                    setImage(result.image);
                    if (result.image?.url) {
                        isImageInUse(result.image.url).then((result) => {
                            if (result && result.success) {
                                setIsInUse({ inUse: result.inUse || false, storeCount: result.storeCount || -1, promotionCount: result.promotionCount || -1 });
                            }
                            else {
                                toast.error(result.error || 'Errore durante la verifica se l\'immagine è in uso');
                            }
                        });
                    }
                }
                else {
                    toast.error(result.error || 'Errore durante la ricerca dell\'immagine');
                    setError(result.error || 'Errore durante la ricerca dell\'immagine');
                }
            });
        }
    }, [imageId]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
                    <p className="text-red-600 text-center">{error}</p>
                    <Link 
                        href="/images"
                        className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                        <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                        Torna alle Immagini
                    </Link>
                </div>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Dettagli Immagine</h2>
                        <Link
                            href="/images"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                        >
                            <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                            Indietro
                        </Link>
                    </div>

                    {/* Image Preview */}
                    <div className="mb-6">
                        <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden bg-gray-100">
                            {image.url && (
                                <Image 
                                    src={image.url} 
                                    alt={`Immagine ${image.id}`}
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Immagine
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={image.url}
                                readOnly
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(image.url);
                                    toast.success('URL copiato negli appunti');
                                }}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                            >
                                Copia
                            </button>
                        </div>
                    </div>
                </div>

                {/* Usage Status */}
                {isInUse && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Stato Utilizzo</h3>
                        
                        {isInUse.inUse ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <MdOutlineWarning className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-900">Immagine in uso</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Questa immagine è attualmente utilizzata e non può essere eliminata.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <MdOutlineStore className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Negozi</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {isInUse.storeCount > 0 ? isInUse.storeCount : 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <MdOutlineLocalOffer className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Promozioni</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {isInUse.promotionCount > 0 ? isInUse.promotionCount : 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <MdOutlineCheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-900">Immagine non in uso</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Questa immagine non è utilizzata da nessun negozio o promozione.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Eliminazione...
                                        </>
                                    ) : (
                                        <>
                                            <MdOutlineDelete className="h-5 w-5 mr-2" />
                                            Elimina Immagine
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}