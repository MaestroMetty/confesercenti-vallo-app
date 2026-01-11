'use client';

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdOutlineImage, MdOutlineArrowBack, MdOutlineSave, MdOutlineDelete } from 'react-icons/md';
import Link from 'next/link';
import Image from "next/image";

//Functions imports
import { deleteStore, getStoreById, updateStore } from "@/lib/ServerActions/StoreActions";

//Types imports
import type Store from "@/types/Store";
import type ImageType from '@/types/Image';

//Components imports
import StorePromotionList from '@/components/Promotions/StorePromotionList';
import ImageSelectionModal from '@/components/Image/ImageSelectionModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function StorePage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = use(params);
    const router = useRouter();

    const [store, setStore] = useState<Store | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const id = parseInt(storeId);
        if (id) {
            getStoreById(id).then((result) => {
                if (result && result.success) {
                    setStore(result.store);
                }
                else {
                    toast.error(result.error || 'Errore durante la ricerca del negozio');
                    setError(result.error || 'Errore durante la ricerca del negozio');
                }
            });
        }
    }, [storeId]);   

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
                    <p className="text-red-600 text-center">{error}</p>
                    <Link 
                        href="/stores"
                        className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                        <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                        Torna ai Negozi
                    </Link>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSave = () => {
        setIsSaving(true);
        updateStore(store.id, store).then((result) => {
            if (result && !result.success) {
                toast.error(result.error || 'Errore durante l\'aggiornamento del negozio');
                setIsSaving(false);
                router.refresh();
            }
            if (result && result.success) {
                toast.success('Negozio aggiornato con successo');
                router.push('/stores');
            }
        });
    }
    
    const handleDelete = () => {
        setIsDeleting(true);
        deleteStore(parseInt(storeId)).then((result) => {
            if (result && !result.success) {
                toast.error(result.error || 'Errore durante la cancellazione del negozio');
                setIsDeleting(false);
                router.refresh();
            }
            if (result && result.success) {
                toast.success('Negozio eliminato con successo');
                router.push('/stores');
            }
        });
    }

    const handleImageSelect = (imageId: number, image: ImageType) => {
        setSelectedImageId(imageId);
        setStore({ ...store!, imageUrl: image.url });
        setIsModalOpen(false);
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-16 pt-8 pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Edit Store Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Modifica Negozio</h2>
                        <Link
                            href="/stores"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 hover:cursor-pointer"
                        >
                            <MdOutlineArrowBack className="h-4 w-4 mr-1" />
                            Indietro
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Negozio *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={store.name}
                                onChange={(e) => setStore({ ...store, name: e.target.value })}
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
                                value={store.address || ''}
                                onChange={(e) => setStore({ ...store, address: e.target.value })}
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
                                value={store.city || ''}
                                onChange={(e) => setStore({ ...store, city: e.target.value })}
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
                                value={store.province || ''}
                                onChange={(e) => setStore({ ...store, province: e.target.value })}
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
                                value={store.postalCode || ''}
                                onChange={(e) => setStore({ ...store, postalCode: e.target.value })}
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
                                    value={store.phone || ''}
                                    onChange={(e) => setStore({ ...store, phone: e.target.value })}
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
                                    value={store.email || ''}
                                    onChange={(e) => setStore({ ...store, email: e.target.value })}
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
                                value={store.website || ''}
                                onChange={(e) => setStore({ ...store, website: e.target.value })}
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
                                value={store.category || ''}
                                onChange={(e) => setStore({ ...store, category: e.target.value })}
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
                                value={store.description || ''}
                                onChange={(e) => setStore({ ...store, description: e.target.value })}
                                placeholder="Inserisci una descrizione del negozio..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 text-gray-700 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Immagine Negozio
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {store.imageUrl && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={store.imageUrl}
                                            alt={store.name}
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
                                    {store.imageUrl ? 'Cambia Immagine' : 'Seleziona Immagine'}
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

                {/* Store Promotions Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <StorePromotionList storeId={store.id} />
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
                title="Elimina Negozio"
                message="Sei sicuro di voler eliminare questo negozio? Questa azione non può essere annullata."
                confirmText="Elimina"
                cancelText="Annulla"
                isDanger={true}
            />
        </div>
    )
}