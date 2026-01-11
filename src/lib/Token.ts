import jwt from 'jsonwebtoken';

//Types import
import TokenPayload from '@/types/TokenPayload';

function getSecretKey() {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not set');
    }
    return secretKey;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, getSecretKey(), { expiresIn: '1d' });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, getSecretKey()) as TokenPayload;
    } catch (error) {
        return null;
    }
}

export function decodeToken(token: string): { id: number, username: string } | null {
    const decoded = jwt.decode(token) as { id: number, username: string };
    if (!decoded) {
        return null;
    }
    return { id: decoded.id, username: decoded.username };
}