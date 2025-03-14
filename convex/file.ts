import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const uploadFile = mutation({
    args: {
        userId: v.string(),
        file: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
    },
    handler: async (ctx, args) => {
        const fileId = await ctx.db.insert("file", {
            userId: args.userId,
            file: args.file,
            fileName: args.fileName,
            fileType: args.fileType,
        });
        return fileId;
      },
});
    