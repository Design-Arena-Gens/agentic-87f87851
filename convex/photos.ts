import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadPhoto = mutation({
  args: {
    imageId: v.string(),
    userId: v.string(),
    username: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const photoId = await ctx.db.insert("photos", {
      imageId: args.imageId,
      userId: args.userId,
      username: args.username,
      profileImage: args.profileImage,
      createdAt: Date.now(),
      likes: [],
    });
    return photoId;
  },
});

export const getAllPhotos = query({
  args: {
    paginationOpts: v.optional(v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    })),
  },
  handler: async (ctx: any, args: any) => {
    const photos = await ctx.db
      .query("photos")
      .order("desc")
      .paginate(args.paginationOpts || { numItems: 20, cursor: null });

    const photosWithUrls = await Promise.all(
      photos.page.map(async (photo: any) => ({
        ...photo,
        imageUrl: await ctx.storage.getUrl(photo.imageId),
      }))
    );

    return {
      ...photos,
      page: photosWithUrls,
    };
  },
});

export const getUserPhotos = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const photosWithUrls = await Promise.all(
      photos.map(async (photo: any) => ({
        ...photo,
        imageUrl: await ctx.storage.getUrl(photo.imageId),
      }))
    );

    return photosWithUrls;
  },
});

export const toggleLike = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const photo = await ctx.db.get(args.photoId);
    if (!photo) throw new Error("Photo not found");

    const likes = photo.likes || [];
    const hasLiked = likes.includes(args.userId);

    await ctx.db.patch(args.photoId, {
      likes: hasLiked
        ? likes.filter((id: string) => id !== args.userId)
        : [...likes, args.userId],
    });

    return !hasLiked;
  },
});

export const deletePhoto = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const photo = await ctx.db.get(args.photoId);
    if (!photo) throw new Error("Photo not found");
    if (photo.userId !== args.userId) throw new Error("Unauthorized");

    await ctx.storage.delete(photo.imageId);
    await ctx.db.delete(args.photoId);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx: any) => {
    return await ctx.storage.generateUploadUrl();
  },
});
