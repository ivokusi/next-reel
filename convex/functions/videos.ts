"use client";

import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { userByClerkId } from "./users";
import { Id } from "@convex/_generated/dataModel";

export const createVideo = mutation({
    args: {
        clerkId: v.string(),
        caption: v.string(),
        hashtags: v.array(v.string()),
        videoUrl: v.string(),
    },
    handler: async (ctx, { clerkId, caption, videoUrl, hashtags }) => {
        const user = await userByClerkId(ctx, clerkId);
        return await ctx.db.insert("videos", { userId: user?._id as Id<'users'>, caption, videoUrl, hashtags, likes: 0, views: 0 });
    }
})

export const getVideosByUserId = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, { clerkId }) => {
        const user = await userByClerkId(ctx, clerkId);
        return await ctx.db.query("videos").withIndex("by_userId", (q) => q.eq("userId", user?._id as Id<'users'>)).collect();
    }
})