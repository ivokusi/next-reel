"use client";

import { Id } from "@convex/_generated/dataModel";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { categoryType } from "@convex/schema";

export const createVideo = mutation({
    args: {
        caption: v.string(),
        hashtags: v.array(v.string()),
        videoUrl: v.string(),
        categories: v.optional(v.object({
            diy: v.optional(v.number()),
            comedy: v.optional(v.number()),
            fitness: v.optional(v.number()),
            travel: v.optional(v.number()),
            sports: v.optional(v.number()),
        }))
    }, handler: async (ctx, { caption, videoUrl, hashtags, categories }) => {
        const user = await getCurrentUserOrThrow(ctx);
        return await ctx.db.insert("videos", { userId: user?._id as Id<'users'>, caption, videoUrl, hashtags, categories, likes: 0, views: 0 });
    }
});

export const deleteVideo = mutation({
    args: {
        videoId: v.id("videos")
    }, handler: async (ctx, { videoId }) => {

        const user = await getCurrentUserOrThrow(ctx);

        const video = await ctx.db.get(videoId);

        if (!video) {
            throw new Error("Video not found");
        }

        if (video.userId !== user._id) {
            throw new Error("You are not authorized to delete this video");
        }

        const videoUrl = video.videoUrl;

        await ctx.db.delete(videoId);

        return videoUrl;

    }
});

export const getVideo = query({
    args: {
        shortTermInterest: categoryType
    }, handler: async (ctx, { shortTermInterest }) => {
        
        const user = await getCurrentUserOrThrow(ctx);

        if (!user) {
            throw new Error("User not authenticated");
        }

        if (!shortTermInterest) {
            throw new Error("No short term interest found");
        }

        const selectedCategory = Object.entries(shortTermInterest)
            .reduce((max, [category, probability]) => 
                probability > max.probability ? { category, probability } : max, 
                { category: "", probability: 0 }
            ).category;

        console.log(selectedCategory);
        const videos = await getVideosByCategory(ctx, { category: selectedCategory });
        const video = videos[Date.now() % videos.length];
        const videoUser = await ctx.db.get(video.userId);

        return {
            _id: video?._id,
            videoUrl: video?.videoUrl,
            views: video?.views,
            likes: video?.likes,
            categories: video?.categories,
            caption: video?.caption,
            hashtags: video?.hashtags,
            username: videoUser?.username as string,
        }

    }
})

const getVideosByCategory = query({
    args: {
        category: v.string()
    }, handler: async (ctx, { category }) => {
        const videos = await ctx.db.query("videos").collect();
        const filteredVideos = videos.filter(video => video.categories && video.categories.hasOwnProperty(category))
        return filteredVideos
    }
})

export const getVideosByUserId = query({
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx);
        const videos =  await ctx.db.query("videos").withIndex("by_userId", (q) => q.eq("userId", user?._id as Id<'users'>)).collect();
        return videos.map(video => {
            return {
                _id: video?._id,
                videoUrl: video?.videoUrl,
                views: video?.views,
                likes: video?.likes,
            }
        })
    }
});

export const addView = mutation({
    args: {
        videoId: v.id("videos")
    }, handler: async (ctx, { videoId }) => {

        const user = await getCurrentUserOrThrow(ctx);

        if (!user) {
            throw new Error("User not authenticated");
        }
        
        const video = await ctx.db.get(videoId);
        
        if (!video) {
            throw new Error("Video not found");
        }

        await ctx.db.patch(videoId, { views: video.views + 1 });
        return video.views + 1;

    }
})