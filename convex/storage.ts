import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// this is to generate the upload url
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
      return await ctx.storage.getUrl(storageId);
    },
  });

