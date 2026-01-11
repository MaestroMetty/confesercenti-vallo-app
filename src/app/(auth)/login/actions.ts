'use server';

import { verifyUser } from '@/db/db';
import { signToken } from '@/lib/Token';
import { cookies } from 'next/headers';

interface LoginResult {
    success: boolean;
    error?: string;
}

export async function loginAction(username: string, password: string): Promise<LoginResult> {
    const isVerified = await verifyUser(username, password);
    
    if (!isVerified) {
        return { success: false, error: 'Credenziali errate' };
    }
    
    const token = signToken({ username: username });
    const cookieStore = await cookies();
    cookieStore.set('token', token);
    
    return { success: true };
}

