import "server-only"

import { db } from './config';
import { eq, sql, arrayContains, count } from 'drizzle-orm';
import { users, stores, promotions, images } from '@/db/schema';
import bcrypt from 'bcrypt';

//Types imports
import type Store from '@/types/Store';
import type Promotion from '@/types/Promotion';
import type User from '@/types/User';
import type Image from '@/types/Image';

//Stores
export async function getStoreById(id: number): Promise<Store | undefined> {
    const storeResult = await db.select().from(stores).where(eq(stores.id, id));
    return storeResult[0];
}

export async function getStores(): Promise<Store[]> {
    //await new Promise(resolve => setTimeout(resolve, 1 * 1000));
    return await db.select().from(stores);
}

export async function createStore(store: Omit<Store, 'id'>): Promise<void> {
    await db.insert(stores).values(store);
}

export async function updateStore(id: number, store: Store): Promise<void> {
    await db.update(stores).set(store).where(eq(stores.id, id));
}

export async function deleteStore(id: number): Promise<void> {
    await db.delete(stores).where(eq(stores.id, id));
}

//Promotions
export async function getPromotionById(id: number): Promise<Promotion | undefined> {
    const promotionResult = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotionResult[0];
}

export async function getPromotions(): Promise<Promotion[]> {
    //await new Promise(resolve => setTimeout(resolve, 3 * 1000));
    return await db.select().from(promotions);
}

export async function createPromotion(promotion: Omit<Promotion, 'id'>): Promise<void> {
    await db.insert(promotions).values(promotion);
}

export async function updatePromotion(id: number, promotion: Promotion): Promise<void> {
    await db.update(promotions).set(promotion).where(eq(promotions.id, id));
}

export async function deletePromotion(id: number): Promise<void> {
    await db.delete(promotions).where(eq(promotions.id, id));
}

export async function getPromotionsByStoreId(id: number): Promise<Promotion[]> {
    const promotionsResult = await db.select().from(promotions).where(eq(promotions.storeId, id));
    return promotionsResult;
}

export async function getPromotionCountByStoreId(id: number): Promise<number> {
    const promotionCount = await db.select({ count: count() }).from(promotions).where(eq(promotions.storeId, id));
    return promotionCount[0].count;
}

//Users
export async function getUserByUsername(username: string): Promise<User | undefined> {
    const userResult = await db.select().from(users).where(eq(users.username, username));
    return userResult[0];
}

export async function verifyUser(username: string, password: string): Promise<boolean> {
    const user = await getUserByUsername(username);
    if (!user) {
        return false;
    }
    return await bcrypt.compare(password, user.password);
}

//Images
export async function getImages(): Promise<Image[]> {    
    //await new Promise(resolve => setTimeout(resolve, 1 * 1000));
    return await db.select().from(images);
}

export async function getImageById(id: number): Promise<Image | undefined> {
    const imageResult = await db.select().from(images).where(eq(images.id, id));
    return imageResult[0];
}

export async function getImageByUrl(url: string): Promise<Image | undefined> {
    const imageResult = await db.select().from(images).where(eq(images.url, url));
    return imageResult[0];
}

export async function deleteImageByUrl(url: string): Promise<void> {
    await db.delete(images).where(eq(images.url, url));
}

export async function createImage(image: Omit<Image, 'id'>): Promise<Image> {
    const result = await db.insert(images).values(image).returning();
    return result[0];
}

export async function deleteImage(id: number): Promise<void> {
    await db.delete(images).where(eq(images.id, id));
}

export async function getStoreCountByImageUrl(url: string): Promise<number> {
    const storeCount = await db.select({ count: count() }).from(stores).where(eq(stores.imageUrl, url));
    return storeCount[0].count;
}

export async function getPromotionCountByImageUrl(url: string): Promise<number> {
    const promotionCount = await db.select({ count: count() }).from(promotions).where(eq(promotions.imageUrl, url));
    return promotionCount[0].count;
}