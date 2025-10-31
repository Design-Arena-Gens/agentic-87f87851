"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PhotoCard from "./PhotoCard";
import { useState } from "react";

export default function MyPhotosTab() {
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("userId");
      if (!id) {
        id = `user-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("userId", id);
      }
      return id;
    }
    return "anonymous";
  });

  const photos = useQuery(api.photos.getUserPhotos, { userId });

  if (photos === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <svg
          className="w-20 h-20 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Photos Yet</h2>
        <p className="text-gray-500 max-w-sm">
          Upload your first photo to start building your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo: any) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            userId={userId}
            showDelete={true}
          />
        ))}
      </div>
    </div>
  );
}
