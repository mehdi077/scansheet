import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({

  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    credits: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),

  file: defineTable({
    userId: v.string(),
    file: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    xcel: v.optional(v.id("_storage")),
  }).index("by_user_id", ["userId"]),

});