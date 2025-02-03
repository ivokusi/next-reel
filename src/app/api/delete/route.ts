import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    
    const { videoUrl } = await request.json();
    const blobPath = videoUrl.split('.com/')[1];
    
    try {
        await del(blobPath);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete blob' }, { status: 500 });
    }
}