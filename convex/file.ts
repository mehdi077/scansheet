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
    limit: v.number(),
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
      .take(args.limit);
    return files;
  },
}); 

// API endpoint that only gets the total count of files for a user
export const getTotalFilesCount = query({
  args: {
    userId: v.string(),
  },
  returns: v.object({
    totalCount: v.number(), 
  }),
  handler: (ctx, args) => {
    return ctx.db
      .query("file")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect()
      .then(files => ({
        totalCount: files.length
      }));
  },
});

// API endpoint that fetches files within a specific range
export const getFilesByRange = query({
  args: {
    userId: v.string(),
    startIndex: v.number(),  // 0-based index (e.g., 0 for first file, 20 for 21st file)
    endIndex: v.number(),    // 0-based and exclusive (e.g., 20 for files 0-19, 40 for files 20-39)
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
    if (args.startIndex < 0 || args.endIndex <= args.startIndex) {
      return [];
    }
    
    // First fetch all the files up to endIndex
    const allFilesUpToEnd = await ctx.db
      .query("file")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.endIndex);
    
    // Then slice to get only the range we want
    // This is needed because Convex doesn't have native support for "skip" functionality
    return allFilesUpToEnd.slice(args.startIndex);
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

        // Get user and verify credits using the userId from the existing file
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", existingFile.userId))
            .first();
        
        if (!user) {
            throw new Error("User not found");
        }

        // Check if user has any credits (0 or less)
        if (user.credits === undefined || user.credits <= 0) {
            throw new Error("Insufficient credits");
        }

        // Update the existing document with the xcel file
        await ctx.db.patch(args.fileDocumentId, {
            xcel: args.xcelStorageId,
            fileName: args.fileName,
        });

        // Reduce user credits by 1
        await ctx.db.patch(user._id, {
            credits: (user.credits - 1),
        });

        return args.fileDocumentId;
    },
});
    