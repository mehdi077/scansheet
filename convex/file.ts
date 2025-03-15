import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const filesByUserId = query({
  args: {
    userId: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("file"),
      _creationTime: v.number(),
      userId: v.string(),
      file: v.id("_storage"),
      fileName: v.string(),
      fileType: v.string(),
      xcel: v.optional(v.id("_storage")),
    })
  ),
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("file")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return files;
  },
}); 

export const uploadXcel = mutation({
    args: {
        userId: v.string(),
        file: v.id("_storage"),
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        // Find the existing file document for the user
        const existingFiles = await ctx.db
            .query("file")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("file"), args.file))
            .collect();

        if (existingFiles.length === 0) {
            // If no existing file is found, create a new document
            return await ctx.db.insert("file", {
                userId: args.userId,
                file: args.file,
                fileName: args.fileName,
                fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                xcel: args.file,
            });
        }

        // Update the existing document with the xcel file
        const existingFile = existingFiles[0];
        await ctx.db.patch(existingFile._id, {
            xcel: args.file,
            fileName: args.fileName, // Update filename if needed
        });

        return existingFile._id;
    },
});

export const updateFileWithXcel = mutation({
    args: {
        fileDocumentId: v.id("file"),
        xcelStorageId: v.id("_storage"),
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        // Verify the document exists
        const existingFile = await ctx.db.get(args.fileDocumentId);
        if (!existingFile) {
            throw new Error("File document not found");
        }

        // Update the existing document with the xcel file
        await ctx.db.patch(args.fileDocumentId, {
            xcel: args.xcelStorageId,
            fileName: args.fileName, // Update filename if needed
        });

        return args.fileDocumentId;
    },
});
    