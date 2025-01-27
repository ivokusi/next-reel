import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

export async function POST(request: Request): Promise<NextResponse> {
  
  const body = (await request.json()) as HandleUploadBody;
 
  try {

    const jsonResponse = await handleUpload({
      body,
      request,
      // Part 1: Before Upload - Validation & Authorization
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: ['video/mp4'],
          tokenPayload: JSON.stringify(clientPayload),
        };
      },

      // Part 2: After Upload - Handle Success
      onUploadCompleted: async ({ blob, tokenPayload }) => {

        try {

          if (!tokenPayload) throw new Error('No token payload');
          
          const payload = JSON.parse(tokenPayload);
          await convex.mutation(api.functions.videos.createVideo, {
            userId: payload.userId,
            hashtags: payload.hashtags,
            caption: payload.caption,
            videoUrl: blob.url
          });
          
        } catch (error) {
          console.error('Error during upload processing:', error);
          throw new Error('Failed to process upload');
        }

      },
    });

    return NextResponse.json(jsonResponse);
    
  } catch (error) {

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, 
    );

  }
}
