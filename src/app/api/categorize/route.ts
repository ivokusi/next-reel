import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {

    const { transcript, caption, hashtags } = await request.json();

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that categorizes videos based on their content. You will receive a video caption, video hashtags, and video transcript. Your task is to assign the video the following categories: comedy, fitness, travel, sports, music, diy. Note, that a video may have more than one category if you deem it resonable. Your output should be in the following json format: { 'comedy': 0.8, 'music': 0.2 }. Notice that the sum of the values in the json object should sum to exactly 1.0.",
                },
                {
                    role: "user",
                    content: `Video Caption: ${caption} \n Video Hashtags: ${hashtags} \n Video Transcript: ${transcript}`
                }
            ],
            response_format: { "type": "json_object" }
        });

        return NextResponse.json({ 
            categories: response.choices[0].message.content 
        });

    } catch (error) {

        console.error('Transcription failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to generate video category' 
        }, { status: 500 });

    }

}