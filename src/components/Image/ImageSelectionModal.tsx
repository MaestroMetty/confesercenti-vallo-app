'use client';

import { useEffect, useState } from 'react';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';
import { toast } from 'sonner';
import UploadForm from './UploadForm';
import Image from 'next/image';
import { getImages } from '@/lib/ServerActions/ImageActions';
import type ImageType from '@/types/Image';
import DiskUsage from './DiskUsage';

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageId: number, image: ImageType) => void;
  selectedImageId?: number | null;
}

export default function ImageSelectionModal({ isOpen, onClose, onSelect, selectedImageId }: ImageSelectionModalProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  async function fetchImages() {
    try {
      setIsLoading(true);
      const result = await getImages();
      
      if (result.success && result.images) {
        setImages(result.images);
      } else {
        toast.error(result.error || 'Errore nel caricamento delle immagini');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Errore nel caricamento delle immagini');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelect = (imageId: number, image: ImageType) => {
    onSelect(imageId, image);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Seleziona Immagine</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdOutlineClose className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {showUploadForm ? 'Annulla Upload' : 'Carica Nuova Immagine'}
            </button>
          </div>

          {showUploadForm ? (
            <div className="mb-4">
              <UploadForm onSuccess={() => {
                setShowUploadForm(false);
                fetchImages();
              }} />
            </div>
          ) : (
            <div className="mb-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  Nessuna immagine disponibile. Carica la prima!
                </div>
              ) : (
                <div className="overflow-x-auto pb-2">
                  <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-4">
                    {images.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleSelect(image.id, image)}
                        className={`w-48 h-48 relative group overflow-hidden rounded-lg border-2 ${
                          selectedImageId === image.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`Image ${image.id}`}
                          className="w-full h-full object-cover"
                          fill
                          sizes="192px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Seleziona
                          </span>
                        </div>
                        {selectedImageId === image.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                            <MdOutlineCheck className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DiskUsage />
        </div>
      </div>
    </div>
  );
}

