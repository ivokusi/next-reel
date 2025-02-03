import fs from "fs";
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    
    try {

        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a temporary file
        const tempFilePath = `/tmp/${file.name}`;
        fs.writeFileSync(tempFilePath, buffer);

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: 'whisper-1',
            language: 'en'
        });

        // Clean up temporary file
        fs.unlinkSync(tempFilePath);

        return NextResponse.json({ 
            transcript: transcription.text 
        });

    } catch (error) {
        console.error('Transcription failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to transcribe video' 
        }, { status: 500 });
    }

}