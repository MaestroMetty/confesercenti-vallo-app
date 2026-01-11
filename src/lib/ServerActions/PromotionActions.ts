'use server';

//DB imports
import { createPromotion as createPromotionDB, deletePromotion as deletePromotionDB, getPromotionById as getPromotionByIdDB, 
    updatePromotion as updatePromotionDB, getStoreById as getStoreByIdDB, deleteImageByUrl as deleteImageByUrlDB, getImageByUrl as getImageByUrlDB,
    getPromotionsByStoreId as getPromotionsByStoreIdDB } from '@/db/db';

//Types imports
import Promotion from '@/types/Promotion';

//Functions imports
import { verifyLogin } from '@/lib/verifyLogin';
import { deleteImageNotInUse as deleteImage } from '@/lib/ServerActions/ImageActions';

export async function createPromotion(formData: FormData): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    const name = formData.get('name') as string;
    const storeId = parseInt(formData.get('storeId') as string);
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const priorityStr = formData.get('priority') as string;
    const priority = priorityStr ? parseInt(priorityStr) : null;

    if (!name) return { success: false, error: 'Il Nome non può essere vuoto' };
    if (!storeId || !(await getStoreByIdDB(storeId))) return { success: false, error: 'Il Negozio non può essere vuoto' };

    const image = await getImageByUrlDB(imageUrl);
    if (!image) return { success: false, error: 'L\'immagine non può essere vuota' };

    try {
        await createPromotionDB({ storeId, name, description, imageUrl, startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null, priority });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Errore durante la creazione della promozione' };
    }
}

export async function deletePromotion(id: number): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    try {
        const promotion = await getPromotionByIdDB(id);
        if (promotion) {
            const imageUrl = promotion.imageUrl;
            if (imageUrl) {
                const image = await getImageByUrlDB(imageUrl);
                if (image) {
                    const result = await deleteImage(image.id, imageUrl);
                    if (!result.success) {
                        return { success: false, error: result.error || 'Errore durante la cancellazione dell\'immagine' };
                    }
                }
            }
        }
        await deletePromotionDB(id);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Errore durante la cancellazione della promozione' };
    }
}

export async function getPromotionById(id: number): Promise<{ success: boolean, error?: string, promotion?: Promotion }> {
    
    try {
        const promotion = await getPromotionByIdDB(id);
        return { success: true, promotion };
    } catch (error) {
        return { success: false, error: 'Errore durante la ricerca della promozione' };
    }
}

export async function getPromotionsByStoreId(storeId: number): Promise<{ success: boolean, error?: string, promotions?: Promotion[] }> {
    
    try {
        const promotions = await getPromotionsByStoreIdDB(storeId);
        return { success: true, promotions };
    } catch (error) {
        console.error('Error getting promotions by store id:', error);
        return { success: false, error: 'Errore durante la ricerca delle promozioni' };
    }
}

export async function updatePromotion(id: number, promotion: Promotion): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }
    
    try {
        await updatePromotionDB(id, promotion);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Errore durante la modifica della promozione' };
    }
}