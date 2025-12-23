import React from "react";

interface ProgressIndicatorProps {
  current: number;
  max: number;
}

export function ProgressIndicator({ current, max }: ProgressIndicatorProps) {
  return (
    <div className="sticky top-4 z-50 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-panel rounded-2xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Your Reflections
            </span>
            <span className="text-sm font-semibold text-purple-900">
              {current}/{max}
            </span>
          </div>
          <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${(current / max) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
