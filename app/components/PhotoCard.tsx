"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Image from "next/image";

interface PhotoCardProps {
  photo: {
    _id: Id<"photos">;
    imageUrl: string | null;
    username: string;
    profileImage?: string;
    likes: string[];
  };
  userId: string;
  showDelete: boolean;
  onDelete?: () => void;
}

export default function PhotoCard({ photo, userId, showDelete, onDelete }: PhotoCardProps) {
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toggleLike = useMutation(api.photos.toggleLike);
  const deletePhoto = useMutation(api.photos.deletePhoto);

  const hasLiked = photo.likes?.includes(userId) || false;
  const likeCount = photo.likes?.length || 0;

  const handleLike = async () => {
    try {
      await toggleLike({ photoId: photo._id, userId });
    } catch (error) {
      console.error("Failed to like photo:", error);
    }
  };

  const handleDoubleTap = () => {
    if (!hasLiked) {
      handleLike();
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePhoto({ photoId: photo._id, userId });
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete photo:", error);
      setIsDeleting(false);
    }
  };

  if (!photo.imageUrl) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        {/* User info header */}
        <div className="flex items-center gap-2 p-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
            {photo.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-800">{photo.username}</span>
        </div>

        {/* Image with double-tap */}
        <div
          className="relative aspect-square bg-gray-100 cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <Image
            src={photo.imageUrl}
            alt="Photo"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Heart animation */}
          <AnimatePresence>
            {showHeartAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <svg
                  className="w-24 h-24 text-white drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 transition-transform active:scale-95"
              aria-label={hasLiked ? "Unlike photo" : "Like photo"}
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  hasLiked ? "text-red-500 fill-red-500" : "text-gray-700"
                }`}
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={hasLiked ? 0 : 2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            </button>

            {showDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete photo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Photo?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. Are you sure you want to delete this photo?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
