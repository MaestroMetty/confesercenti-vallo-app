import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Validate filename to prevent directory traversal
        if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return new NextResponse('Invalid filename', { status: 400 });
        }

        // Build file path
        const filepath = join(process.cwd(), 'uploads', filename);

        // Check if file exists
        if (!existsSync(filepath)) {
            return new NextResponse('Image not found', { status: 404 });
        }

        // Read file
        const fileBuffer = await readFile(filepath);

        // Determine content type based on file extension
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypeMap: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
        };
        const contentType = contentTypeMap[ext || 'webp'] || 'image/webp';

        // Return image with appropriate headers
        // Convert Buffer to Uint8Array for Response compatibility
        return new Response(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

