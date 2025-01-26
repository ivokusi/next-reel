import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    
    users: defineTable({
        clerkId: v.string(),
        username: v.string(),
        image: v.string(),
    })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),

});