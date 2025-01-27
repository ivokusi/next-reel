"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { api } from '@convex/_generated/api';
import { upload } from '@vercel/blob/client';
import { ConvexHttpClient } from 'convex/browser';
import { Forward, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

export default function CreatePage() {
  
    const inputFileRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [caption, setCaption] = useState<string>('');
    const { user } = useUser();
    const router = useRouter();

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        
        const file = event.target.files?.[0];
        
        if (file && file.type.startsWith('video/')) {

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            }

            reader.readAsDataURL(file);

        } else {

            setPreview(null);

        }

    }

    function handleAddHashtag(e: React.KeyboardEvent<HTMLInputElement>) {
        
        if (e.key === 'Enter') {
            
            const value = e.currentTarget.value;
            const values = value.split(' ');

            const uniqueValues = values.filter((value) => !hashtags.includes(value));
            
            if (uniqueValues.length > 0) {
                setHashtags([...hashtags, ...uniqueValues]);
            }
            
            e.currentTarget.value = '';

        }

    }
    
    function handleRemoveHashtag(index: number) {
        setHashtags(prevHashtags => prevHashtags.filter((_, i) => i !== index));
    }

    function handlePauseVideo() {
        const videoElement = videoRef.current;
        if (videoElement?.paused) {
            videoElement?.play();
        } else {
            videoElement?.pause();
        }
    }

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        
        event.preventDefault();

        if (!inputFileRef.current?.files?.[0]) return;

        const file = inputFileRef.current.files[0];

        const newBlob = await upload(uuidv4(), file, {
            access: 'public',
            handleUploadUrl: '/api/create',
            clientPayload: JSON.stringify({
                clerkId: user?.id as string,
                caption,
                hashtags
            })
        });

        await convex.mutation(api.functions.videos.createVideo, {
            clerkId: user?.id as string,
            caption,
            hashtags,
            videoUrl: newBlob.url
        });

        router.push('/profile');

    }

    return (

        <div className="w-[90%] h-[90%] flex items-center justify-center gap-8">
            <div className="w-[50%] h-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Create</h1>
                <Label htmlFor="video-upload">Upload a video to get started</Label>
                <Input 
                    id="video-upload"
                    type="file" 
                    ref={inputFileRef} 
                    accept="video/*"    
                    required
                    onChange={handleFileChange}
                />
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input 
                    id="hashtags"
                    type="text"
                    onKeyDown={handleAddHashtag}
                />
                <div className="flex flex-wrap gap-4">
                    {hashtags.length > 0 && hashtags.map((hashtag, index) => (
                        <div className="flex items-center gap-1" key={uuidv4()}>
                            <Badge variant="secondary" key={uuidv4()}>
                                {hashtag}
                            </Badge>
                            <X className="w-4 h-4 cursor-pointer" key={uuidv4()} onClick={() => handleRemoveHashtag(index)} />
                        </div>
                    ))}
                </div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea 
                    id="caption"
                    placeholder="Enter a caption for your video"
                    onChange={(e) => setCaption(e.target.value)}
                />
                <Button variant="cyan_outline" type="submit" className="w-fit" onClick={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <Forward className="size-4" />
                        Upload
                    </div>
                </Button>
            </div>
            <Separator orientation="vertical" className="h-[90%]" />
            <div className="h-full flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Preview</h1>
                {
                    preview ? (
                        <div className="relative w-[400px] h-[711.66px]">
                            <video 
                                ref={videoRef}
                                src={preview} 
                                className="rounded-lg" 
                                autoPlay
                                loop
                                onClick={handlePauseVideo}
                            />
                            <div className="absolute inset-0 hover:bg-black/60 flex flex-col justify-end group " onClick={handlePauseVideo}>
                                <div className="flex flex-col text-white p-4 invisible group-hover:visible gap-4">
                                    <p className="text-sm font-semibold ">@{user?.username}</p>
                                    <div className="flex flex-wrap">
                                        {hashtags.map((hashtag) => (
                                            <span key={uuidv4()} className="mr-2 text-sm font-semibold">{hashtag}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm">{caption}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-[400px] h-[711.66px] bg-gray-500 animate-pulse rounded-lg mx-auto">
                            {''}
                        </div>
                    )
                }
            </div>
            
        </div>

    )
    
}