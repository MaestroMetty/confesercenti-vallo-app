'use client';

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

//Functions imports
import { deleteUnusedImages } from "@/lib/ServerActions/ImageActions";

export default function CleanUnusedImages() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleCleanUnusedImages = async () => {
        setLoading(true);
        try {
            const result = await deleteUnusedImages();
            if (result && result.success) {
                toast.success('Immagini non in uso cancellate con successo');
                // Reload the page to show updated list
                router.refresh();
            } else {
                toast.error(result.error || 'Errore durante la cancellazione delle immagini non in uso');
            }
        } catch (error) {
            console.error('Errore durante la cancellazione delle immagini non in uso:', error);
            toast.error('Errore durante la cancellazione delle immagini non in uso');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleCleanUnusedImages}
        >
            {loading ? 'Caricamento...' : 'Rimuovi Immagini Non in Uso'}
        </button>
    )
}

