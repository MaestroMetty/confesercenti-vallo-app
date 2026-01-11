import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/Token';
import TokenPayload from '@/types/TokenPayload';

export async function verifyLogin(): Promise<TokenPayload | false> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
        return false;
    }

    const verifiedToken: TokenPayload = verifyToken(token.value) as TokenPayload;
    if (!verifiedToken) {
        return false;
    }

    return verifiedToken;
}