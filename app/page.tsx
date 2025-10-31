"use client";

import { useState } from "react";
import StreamTab from "./components/StreamTab";
import MyPhotosTab from "./components/MyPhotosTab";
import UploadModal from "./components/UploadModal";
import BottomNav from "./components/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"stream" | "my-photos">("stream");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-900">PhotoShare</h1>
          </div>
        </header>

        {/* Content */}
        <div className="min-h-[calc(100vh-120px)]">
          {activeTab === "stream" && <StreamTab />}
          {activeTab === "my-photos" && <MyPhotosTab />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </main>
  );
}
