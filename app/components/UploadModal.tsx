"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, DragEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const uploadPhoto = useMutation(api.photos.uploadPhoto);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Get userId from localStorage
      let userId = localStorage.getItem("userId");
      let username = localStorage.getItem("username");

      if (!userId) {
        userId = `user-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("userId", userId);
      }

      if (!username) {
        username = `User${Math.floor(Math.random() * 9999)}`;
        localStorage.setItem("username", username);
      }

      setUploadProgress(30);

      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      setUploadProgress(50);

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      setUploadProgress(80);

      // Save photo metadata to database
      await uploadPhoto({
        imageId: storageId,
        userId,
        username,
      });

      setUploadProgress(100);

      // Reset and close
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setUploadProgress(0);
        setIsUploading(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full sm:max-w-lg sm:rounded-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upload Photo</h2>
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                      isDragging ? "text-blue-500" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragging ? "Drop your photo here" : "Drag and drop your photo"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF, WebP</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Select image file"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {preview && (
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!isUploading && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Change Photo
                      </button>
                      <button
                        onClick={handleUpload}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
