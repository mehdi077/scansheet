import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
    args: {
      userId: v.string(),
      name: v.string(),
      email: v.string(),
    },
    handler: async (ctx, { userId, name, email }) => {
      // Check if user exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_user_id", (q) => q.eq("userId", userId))
        .first();
  
      if (existingUser) {
        // Update existing user while preserving credits
        await ctx.db.patch(existingUser._id, {
          name,
          email,
          // If credits don't exist, initialize them to 10
          credits: existingUser.credits ?? 10,
        });
        return {
            id: existingUser._id,
            new: false
        }
      }
  
      // Create new user
      const newUserId = await ctx.db.insert("users", {
        userId,
        name,
        email,
        credits: 10,
      });
  
      return {
        id: newUserId,
        new: true
      };
    },
  });

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return user;
  },
});
