import { mutation, query } from "@convex/_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const addLike = mutation({
    
    args: {
        videoId: v.id("videos")
    }, handler: async (ctx, { videoId }) => {
        
        const user = await getCurrentUserOrThrow(ctx);
        
        const video = await ctx.db.get(videoId);

        if (!video) {
            throw new Error("Video not found");
        }

        await ctx.db.patch(videoId, { likes: video.likes + 1 });

        return await ctx.db.insert("likes", { userId: user._id, videoId })

    }

});

export const removeLike = mutation({
    
    args: {
        videoId: v.id("videos")
    }, handler: async (ctx, { videoId }) => {
        
        const user = await getCurrentUserOrThrow(ctx);
        
        const video = await ctx.db.get(videoId);

        if (!video) {
            throw new Error("Video not found");
        }

        await ctx.db.patch(videoId, { likes: video.likes - 1 });

        const like = await ctx.db.query("likes").withIndex("by_videoId_userId", q => q.eq("videoId", videoId).eq("userId", user._id)).unique();

        if (!like) {
            throw new Error("Like not found");
        }

        return await ctx.db.delete(like._id);

    }
    
});

export const userLiked = query({
    args: {
        videoId: v.id("videos")
    }, handler: async (ctx, { videoId }) => {
        
        const user = await getCurrentUserOrThrow(ctx);
        
        const like = await ctx.db.query("likes").withIndex("by_videoId_userId", q => q.eq("videoId", videoId).eq("userId", user._id)).unique();
        return like !== null;

    }
})