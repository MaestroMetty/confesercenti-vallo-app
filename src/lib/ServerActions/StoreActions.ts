'use server';

//DB imports
import { createStore as createStoreDB, deleteStore as deleteStoreDB, getStoreById as getStoreByIdDB,
    updateStore as updateStoreDB, getStores as getStoresDB, 
    getImageByUrl as getImageByUrlDB, getPromotionCountByStoreId as getPromotionCountByStoreIdDB } from '@/db/db';

//Types imports
import Store from '@/types/Store';

//Functions imports
import { verifyLogin } from '@/lib/verifyLogin';
import { deleteImageNotInUse as deleteImage  } from '@/lib/ServerActions/ImageActions';

export async function createStore(formData: FormData): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    const name = formData.get('name') as string;
    const address = formData.get('address') as string || null;
    const city = formData.get('city') as string || null;
    const province = formData.get('province') as string || null;
    const postalCode = formData.get('postalCode') as string || null;
    const phone = formData.get('phone') as string || null;
    const email = formData.get('email') as string || null;
    const website = formData.get('website') as string || null;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string || null;
    const description = formData.get('description') as string || '';

    if (!name) return { success: false, error: 'Il Nome non può essere vuoto' };
    if (!city) return { success: false, error: 'La Città non può essere vuota' };
    if (!province) return { success: false, error: 'La Provincia non può essere vuota' };
    if (!postalCode) return { success: false, error: 'Il CAP non può essere vuoto' };


    const image = await getImageByUrlDB(imageUrl);
    if (!image) return { success: false, error: 'L\'immagine non può essere vuota' };

    try {
        await createStoreDB({ name, address, city: city ? city.trim().toLowerCase() : null, province: province ? province.trim().toUpperCase() : null, postalCode: postalCode ? postalCode.trim() : null, phone, email, website, imageUrl, category: category ? category.trim().toLowerCase() : null, description });
        return { success: true };
    } catch (error) {
        console.error('Error creating store:', error);
        return { success: false, error: 'Errore durante la creazione del negozio' };
    }
}

export async function deleteStore(id: number): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    const isInUse = await isStoreInUse(id);
    if (isInUse && isInUse.inUse) {
        return { success: false, error: 'Ci sono promozioni associate a questo negozio' };
    }

    try {
        const store = await getStoreByIdDB(id);
        if (store) {
            const imageUrl = store.imageUrl;
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
        await deleteStoreDB(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting store:', error);
        return { success: false, error: 'Errore durante la cancellazione del negozio' };
    }
}

export async function updateStore(id: number, store: Store): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    try {
        await updateStoreDB(id, { ...store, category: store.category ? store.category.trim().toLowerCase() : null,
            city: store.city ? store.city.trim().toLowerCase() : null, province: store.province ? store.province.trim().toUpperCase() : null });
        return { success: true };
    } catch (error) {
        console.error('Error updating store:', error);
        return { success: false, error: 'Errore durante l\'aggiornamento del negozio' };
    }
}

export async function getAllStores(): Promise<{ success: boolean, error?: string, stores: Store[] }> {

    try {
        const stores: Store[] = await getStoresDB();
        return { success: true, stores };
    } catch (error) {
        console.error('Error getting all stores:', error);
        return { success: false, error: 'Errore durante la ricerca dei negozi', stores: [] };
    }
}

export async function getStoreById(id: number): Promise<{ success: boolean, error?: string, store: Store | undefined }> {
    try {
        const store = await getStoreByIdDB(id);
        return { success: true, store };
    } catch (error) {
        console.error('Error getting store by id:', error);
        return { success: false, error: 'Errore durante la ricerca del negozio', store: undefined };
    }
}

export async function isStoreInUse(id: number): Promise<{ success: boolean, error?: string, inUse?: boolean, promotionCount?: number }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }
    const promotionCount = await getPromotionCountByStoreIdDB(id);
    return { success: true, inUse: promotionCount > 0, promotionCount };
}