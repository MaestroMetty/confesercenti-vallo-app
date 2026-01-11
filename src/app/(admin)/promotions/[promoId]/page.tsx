'use client';

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdOutlineImage, MdOutlineArrowBack, MdOutlineSave, MdOutlineDelete, MdOutlineStore } from 'react-icons/md';
import Link from 'next/link';
import Image from "next/image";
import ImageSelectionModal from '@/components/Image/ImageSelectionModal';
import ConfirmModal from '@/components/ConfirmModal';

//Functions imports
import { deletePromotion, getPromotionById, updatePromotion } from "@/lib/ServerActions/PromotionActions";
import { getStoreById } from "@/lib/ServerActions/StoreActions";

//Types imports
import type Promotion from "@/types/Promotion";
import type Store from "@/types/Store";
import type ImageType from '@/types/Image';

export default function PromotionPage({ params }: { params: Promise< { promoId: string }> }) {
    const { promoId } = use(params);
    const router = useRouter();

    const [promotion, setPromotion] = useState<Promotion | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [store, setStore] = useState<Store | null | undefined>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const id = parseInt(promoId);
        if (id) {
            getPromotionById(id).then((result) => {
                if (result && result.success) {
                    setPromotion(result.promotion);
                    const storeId = result.promotion?.storeId;
                    if(storeId){
                        getStoreById(storeId).then((result) => {
                            if (result && result.success) {
                                setStore(result.store);
                            }
                        });
                    }
                }
                else {
                    toast.error(result.error || 'Errore durante la ricerca della promozione');
                    setError(result.error || 'Errore durante la ricerca della promozione');
                }
            });
        }
    }, [promoId]);   

    if (error) {
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

    if (!promotion || !store) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSave = () => {
        setIsSaving(true);
        updatePromotion(promotion.id, promotion).then((result) => {
            if (result && !result.success) {
                toast.error(result.error || 'Errore durante l\'aggiornamento della promozione');
                setIsSaving(false);
                router.refresh();
            }
            if (result && result.success) {
                toast.success('Promozione aggiornata con successo');
                router.push('/promotions');
            }
        });
    }
    
    const handleDelete = () => {
        setIsDeleting(true);
        deletePromotion(parseInt(promoId)).then((result) => {
            if (result && !result.success) {
                toast.error(result.error || 'Errore durante la cancellazione della promozione');
                setIsDeleting(false);
                router.refresh();
            }
            if (result && result.success) {
                toast.success('Promozione eliminata con successo');
                router.push('/promotions');
            }
        });
    }

    const handleImageSelect = (imageId: number, image: ImageType) => {
        setSelectedImageId(imageId);
        setPromotion({ ...promotion!, imageUrl: image.url });
        setIsModalOpen(false);
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Modifica Promozione</h2>
                        <Link
                            href="/promotions"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                        >
                            <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                            Indietro
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Promozione *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={promotion.name || ''}
                                onChange={e => setPromotion({ ...promotion, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                                Negozio
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <MdOutlineStore className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{store.name}</p>
                                    {store.address && (
                                        <p className="text-sm text-gray-500">{store.address}</p>
                                    )}
                                </div>
                                <Link
                                    href={`/stores/${store.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                                >
                                    Vedi Negozio
                                </Link>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={promotion.description || ''}
                                onChange={e => setPromotion({ ...promotion, description: e.target.value })}
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
                                    value={promotion.startDate ? promotion.startDate.toISOString().split('T')[0] : ''}
                                    onChange={e => setPromotion({ ...promotion, startDate: new Date(e.target.value) })}
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
                                    value={promotion.endDate ? promotion.endDate.toISOString().split('T')[0] : ''}
                                    onChange={e => setPromotion({ ...promotion, endDate: new Date(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Immagine Promozione
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {promotion.imageUrl && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={promotion.imageUrl}
                                            alt={promotion.name}
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
                                    {promotion.imageUrl ? 'Cambia Immagine' : 'Seleziona Immagine'}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || isDeleting}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:cursor-pointer"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Salvataggio...
                                    </>
                                ) : (
                                    <>
                                        <MdOutlineSave className="h-5 w-5 mr-2" />
                                        Salva Modifiche
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isSaving || isDeleting}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:cursor-pointer"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Eliminazione...
                                    </>
                                ) : (
                                    <>
                                        <MdOutlineDelete className="h-5 w-5 mr-2" />
                                        Elimina
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ImageSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleImageSelect}
                selectedImageId={selectedImageId}
            />

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Elimina Promozione"
                message="Sei sicuro di voler eliminare questa promozione? Questa azione non può essere annullata."
                confirmText="Elimina"
                cancelText="Annulla"
                isDanger={true}
            />
        </div>
    )
}