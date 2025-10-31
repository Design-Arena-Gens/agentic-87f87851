import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  photos: defineTable({
    imageId: v.string(),
    userId: v.string(),
    username: v.string(),
    profileImage: v.optional(v.string()),
    createdAt: v.number(),
    likes: v.array(v.string()),
  }).index("by_creation", ["createdAt"])
    .index("by_user", ["userId"]),
});
