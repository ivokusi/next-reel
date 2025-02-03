"use client"

import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ChevronRight, Forward, Heart, MessageCircleMore } from "lucide-react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function FeedPage() {
 
    const { isAuthenticated } = useConvexAuth();
    
    const createInterest = useMutation(api.functions.interest.createInterest);
    const updateInterest = useMutation(api.functions.interest.updateInterest);
    const addLike = useMutation(api.functions.likes.addLike);
    const removeLike = useMutation(api.functions.likes.removeLike);
    const addView = useMutation(api.functions.videos.addView);

    const shortTermInterest = useQuery(api.functions.interest.getInterest, isAuthenticated ? { interestPeriod: "short" } : "skip");
    const longTermInterest = useQuery(api.functions.interest.getInterest, isAuthenticated ? { interestPeriod: "long" } : "skip");
    const video = useQuery(api.functions.videos.getVideo, shortTermInterest ? { shortTermInterest: shortTermInterest.interest } : "skip");
    const userLiked = useQuery(api.functions.likes.userLiked, video ? { videoId: video._id } : "skip");
    
    const videoRef = useRef<HTMLVideoElement>(null);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false);

    function handleLike() {

        if (!video) {
            throw new Error();
        }

        if (userLiked) {
            setLiked(false)
            removeLike({ videoId: video._id });
        } else {
            setLiked(true)
            addLike({ videoId: video._id });
        }

    }

    function handlePauseVideo() {
        const videoElement = videoRef.current;
        if (videoElement?.paused) {
            videoElement?.play();
        } else {
            videoElement?.pause();
        }
    }

    async function handleVideoView() {
        if (videoRef.current) {
            
            const newTime = videoRef.current.currentTime;
            setCurrentTime(newTime);

            if (!video) {
                throw new Error();
            }

            if (newTime > 5 && currentTime < 5) {
                await addView({ videoId: video._id });
            }

        }
    }
   
    if (!shortTermInterest && longTermInterest) {
        createInterest({ interestPeriod: "short", interest: longTermInterest.interest });
    }

    if (!video) {
        return (
            <div>Loading...</div>
        )
    }

    async function handleNextVideo() {

        console.log("here");

        if (!videoRef.current) {
            throw new Error("No video");
        }

        const percent = currentTime / videoRef.current?.duration;
        const weight = 0.3 * Number(liked) + 0.2 * (percent - 0.2);
    
        const newInterest = Object.entries(shortTermInterest?.interest || {}).reduce((acc: Record<string, number>, [key, val]) => {
            acc[key] = val * (1 - weight);
            return acc;
        }, {});

        const videoWeight = Object.entries(video?.categories || {}).reduce((acc: Record<string, number>, [key, val]) => {
            acc[key] = val * weight;
            return acc;
        }, {});

        // Add videoWeight to newInterest
        Object.keys(newInterest).forEach(key => {
            if (videoWeight[key] !== undefined) {
                newInterest[key] += videoWeight[key];
            }
        });

        if (!shortTermInterest) {
            throw new Error();
        }

        await updateInterest({ interest: newInterest, interestId: shortTermInterest?._id })

    }

    return (

        <div className="flex items-center justify-center gap-4">
            <div className="relative w-[400px] h-[711.66px]">
                <video 
                    ref={videoRef}
                    src={video.videoUrl} 
                    className="rounded-lg" 
                    loop
                    onClick={handlePauseVideo}
                    onTimeUpdate={handleVideoView}
                />
                <div className="absolute inset-0 hover:bg-black/60 flex flex-col justify-end group " onClick={handlePauseVideo}>
                    <div className="flex flex-col text-white p-4 invisible group-hover:visible gap-4">
                        <p className="text-sm font-semibold ">@{video.username}</p>
                        <div className="flex flex-wrap">
                            {video.hashtags.map((hashtag) => (
                                <span key={uuidv4()} className="mr-2 text-sm font-semibold">{hashtag}</span>
                            ))}
                        </div>
                        <p className="text-sm">{video.caption}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items gap-6">
                <Heart className={`${userLiked ? "fill-[#fd3e3e]" : ""} size-8 text-[#fd3e3e] hover:fill-[#fd3e3e]`} onClick={handleLike} />
                <MessageCircleMore className="size-8" />
                <Forward className="size-8" />
            </div>
            <Button size={"icon"} onClick={handleNextVideo}>
                <ChevronRight />
            </Button>
        </div>

    )

}