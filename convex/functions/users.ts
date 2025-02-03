import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { internalMutation, query, QueryCtx } from "../_generated/server";
import { createInterest, deleteInterest } from "./interest";

export const current = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {
        
        const userAttributes = {
            username: data.username ?? "",
            clerkId: data.id,
            image: data.image_url ?? "",
        };

        const user = await userByClerkId(ctx, data.id);
        
        if (user === null) {
            
            const userId = await ctx.db.insert("users", userAttributes);

            const interest = {
                diy: 0.2,
                comedy: 0.2,
                fitness: 0.2,
                travel: 0.2,
                sports: 0.2
            }

            await createInterest(ctx, { userId, interestPeriod: "long", interest });

        } else {
            await ctx.db.patch(user._id, userAttributes);
        }

    },
});

export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
        
        const user = await userByClerkId(ctx, clerkUserId);

        if (user !== null) {
            
            await ctx.db.delete(user._id);
            
            await deleteInterest(ctx, { userId: user._id, interestPeriod: "long" });
            await deleteInterest(ctx, { userId: user._id, interestPeriod: "short" });

        } else {
            console.warn(
                `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
            );
        }

    },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    
    const userRecord = await getCurrentUser(ctx);
    
    if (!userRecord) { 
        throw new Error("Can't get current user");
    }
    
    return userRecord;

}

export async function getCurrentUser(ctx: QueryCtx) {
    
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity === null) {
        return null;
    }

    return await userByClerkId(ctx, identity.subject);

}

export async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
}