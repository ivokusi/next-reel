import { mutation, query } from "@convex/_generated/server";
import { categoryType } from "@convex/schema";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const createInterest = mutation({
    
    args: {
        userId: v.optional(v.id("users")),
        interestPeriod: v.union(v.literal("short"), v.literal("long")),
        interest: categoryType
    }, handler: async (ctx, { userId, interestPeriod, interest }) => {
        
        if (userId) {
            
            const existingInterest = await getInterest(ctx, { userId, interestPeriod });

            if (existingInterest) {
                return null;
            }

            await ctx.db.insert("interest", { userId, interestPeriod, interest });

        }

        const user = await getCurrentUserOrThrow(ctx);

        const existingInterest = await getInterest(ctx, { userId: user._id, interestPeriod });

        if (existingInterest) {
            return null;
        }

        await ctx.db.insert("interest", { userId: user._id, interestPeriod, interest });

    }

});

export const deleteInterest = mutation({
    
    args: {
        userId: v.id("users"),
        interestPeriod: v.union(v.literal("short"), v.literal("long"))
    }, handler: async (ctx, { userId, interestPeriod }) => {
        
        const interest = await getInterest(ctx, { userId, interestPeriod });

        if (!interest) {
            throw new Error("Interest doesn't exist");
        }
        
        if (interest !== null) {
            return await ctx.db.delete(interest._id);
        }

    }

});

export const updateInterest = mutation({
    args: {
        interestId: v.id("interest"),
        interest: categoryType
    }, handler: async (ctx, { interestId, interest }) => {
        await ctx.db.patch(interestId, { interest });
    }
})

export const getInterest = query({

    args: {
        userId: v.optional(v.id("users")),
        interestPeriod: v.union(v.literal("short"), v.literal("long"))
    }, handler: async (ctx, { userId, interestPeriod }) => {
        
        if (userId) {
            return await ctx.db.query("interest").withIndex("by_userId_interestPeriod", (q) => q.eq("userId", userId).eq("interestPeriod", interestPeriod)).unique();
        }

        const user = await getCurrentUserOrThrow(ctx);
        
        return await ctx.db.query("interest").withIndex("by_userId_interestPeriod", (q) => q.eq("userId", user._id).eq("interestPeriod", interestPeriod)).unique();

    }

});