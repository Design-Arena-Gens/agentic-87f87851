"use client";

interface BottomNavProps {
  activeTab: "stream" | "my-photos";
  onTabChange: (tab: "stream" | "my-photos") => void;
  onUploadClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onUploadClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto flex justify-around items-center h-16 px-4">
        {/* Stream Tab */}
        <button
          onClick={() => onTabChange("stream")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "stream" ? "text-blue-600" : "text-gray-500"
          }`}
          aria-label="Stream"
          aria-current={activeTab === "stream" ? "page" : undefined}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span className="text-xs font-medium">Stream</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-blue-600"
          aria-label="Upload photo"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-1 shadow-lg transform transition-transform active:scale-95">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Upload</span>
        </button>

        {/* My Photos Tab */}
        <button
          onClick={() => onTabChange("my-photos")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "my-photos" ? "text-blue-600" : "text-gray-500"
          }`}
          aria-label="My Photos"
          aria-current={activeTab === "my-photos" ? "page" : undefined}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs font-medium">My Photos</span>
        </button>
      </div>
    </nav>
  );
}
