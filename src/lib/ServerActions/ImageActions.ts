'use server';

import { mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

//DB imports
import { createImage as createImageDB, getImages as getImagesDB, deleteImage as deleteImageDB, getImageById as getImageByIdDB,
    getStoreCountByImageUrl as getStoreCountByImageUrlDB, getPromotionCountByImageUrl as getPromotionCountByImageUrlDB } from '@/db/db';

//Types imports
import type Image from '@/types/Image';

//Functions imports
import { verifyLogin } from '@/lib/verifyLogin';

export async function uploadImage(formData: FormData): Promise<{ success: boolean, error?: string, image?: Image }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    try {
        const file = formData.get('file') as File;
        
        if (!file) {
            return { success: false, error: 'Nessun file selezionato' };
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return { success: false, error: 'Formato file non valido. Usa JPG, PNG, GIF o WebP' };
        }

        // Validate file size (max 5MB)
        const maxSize = 1 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { success: false, error: 'File troppo grande. Dimensione massima: 1MB' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with .webp extension
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}.webp`;
        
        // Ensure uploads directory exists (outside public for security)
        const uploadsDir = join(process.cwd(), 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Convert image to WebP and save
        const filepath = join(uploadsDir, filename);
        await sharp(buffer)
            .webp({ quality: 85 }) // Convert to WebP with 85% quality
            .toFile(filepath);

        // Store in database with new URL pattern
        const imageUrl = `/media/${filename}`;
        const image = await createImageDB({ url: imageUrl });

        return { success: true, image };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Errore durante il caricamento dell\'immagine' };
    }
}

export async function getImageById(id: number): Promise<{ success: boolean, error?: string, image?: Image }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }
    try {
        const image = await getImageByIdDB(id);
        return { success: true, image };
    } catch (error) {
        console.error('Error fetching image:', error);
        return { success: false, error: 'Errore durante la ricerca dell\'immagine' };
    }
}

export async function getImages(): Promise<{ success: boolean, error?: string, images?: Image[] }> {

    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    try {
        const images = await getImagesDB();
        return { success: true, images };
    } catch (error) {
        console.error('Error fetching images:', error);
        return { success: false, error: 'Errore durante il caricamento delle immagini' };
    }
}

export async function deleteImage(id: number, url: string): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    const isInUse = await isImageInUse(url);
    if (isInUse && isInUse.inUse) {
        return { success: false, error: 'Immagine in uso' };
    }

    try {
        // Delete file from file system
        const success = await deleteImageFile(url);
        if (!success) {
            return { success: false, error: 'Errore durante la cancellazione del file dell\'immagine' };
        }

        // Delete from database
        await deleteImageDB(id);    
            
        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: 'Errore durante la cancellazione dell\'immagine' };
    }
}

export async function deleteImageNotInUse(id: number, url: string): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }
    try {
        // Delete file from file system
        const success = await deleteImageFile(url);
        if (!success) {
            return { success: false, error: 'Errore durante la cancellazione del file dell\'immagine' };
        }

        // Delete from database
        await deleteImageDB(id);    
            
        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: 'Errore durante la cancellazione dell\'immagine' };
    }
}

export async function isImageInUse(url: string): Promise<{ success: boolean, error?: string, inUse?: boolean, storeCount?: number, promotionCount?: number }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }
    try {
        const storeCount = await getStoreCountByImageUrlDB(url);
        const promotionCount = await getPromotionCountByImageUrlDB(url);
        return { success: true, inUse: storeCount > 0 || promotionCount > 0, storeCount, promotionCount };
    } catch (error) {
        console.error('Error checking if image is in use:', error);
        return { success: false, error: 'Errore durante la verifica se l\'immagine è in uso' };
    }
}

export async function deleteUnusedImages(): Promise<{ success: boolean, error?: string }> {
    // Authentication check
    const user = await verifyLogin();
    if (!user) {
        return { success: false, error: 'Non autorizzato' };
    }

    let count = 0;

    try {
        const result = await getImages();
        if (!result.success) {
            return { success: false, error: result.error || 'Errore durante il caricamento delle immagini' };
        }
        if (result.images === undefined || result.images.length === 0) {
            return { success: false, error: 'Nessuna immagine trovata' };
        }
        const images = result.images;
        for (const image of images) {
            const isInUse = await isImageInUse(image.url);
            if (!isInUse.success) {
                continue;
            }
            if (!isInUse.inUse) {
                const result = await deleteImageNotInUse(image.id, image.url);
                if (!result.success) {
                    continue;
                }
                count++;
            }
        }
        return { success: count > 0, error: count > 0 ? 'Immagini non in uso cancellate con successo' : 'Nessuna immagine non in uso trovata' };
    } catch (error) {
        console.error('Error deleting unused images:', error);
        return { success: false, error: 'Errore durante la cancellazione delle immagini non in uso' };
    }
}

async function deleteImageFile(url: string): Promise<boolean> {
    const filename = url.split('/').pop(); // Extract filename from URL
    if (filename) {
        const filepath = join(process.cwd(), 'uploads', filename);
        if (existsSync(filepath)) {
            await unlink(filepath);
            return true;
        }
    }
    return false;
}