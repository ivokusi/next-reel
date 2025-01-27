import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createVideo = mutation({
    args: {
        userId: v.id("users"),
        caption: v.string(),
        videoUrl: v.string(),
        hashtags: v.array(v.string()),
    },
    handler: async (ctx, { userId, caption, videoUrl, hashtags }) => {
        return await ctx.db.insert("videos", { userId, caption, videoUrl, hashtags, likes: 0, views: 0 });
    }
})

export const getVideosByUserId = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        return await ctx.db.query("videos").withIndex("by_userId", (q) => q.eq("userId", userId)).collect();
    }
})