import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const categoryType = v.optional(v.object({
    diy: v.optional(v.number()),
    comedy: v.optional(v.number()),
    fitness: v.optional(v.number()),
    travel: v.optional(v.number()),
    sports: v.optional(v.number()),
}));

export default defineSchema({
    
    users: defineTable({
        clerkId: v.string(),
        username: v.string(),
        image: v.string(),
    })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
    
    videos: defineTable({
        userId: v.id("users"),
        hashtags: v.array(v.string()),
        caption: v.string(),
        categories: categoryType,
        videoUrl: v.string(),
        views: v.number(),
        likes: v.number(),
    }).index("by_userId", ["userId"]),

    likes: defineTable({
        videoId: v.id("videos"),
        userId: v.id("users"),
    }).index("by_videoId_userId", ["videoId", "userId"]),

    interest: defineTable({
        userId: v.id("users"),
        interestPeriod: v.union(v.literal("short"), v.literal("long")),
        interest: categoryType,
    }).index("by_userId_interestPeriod", ["userId", "interestPeriod"])

});