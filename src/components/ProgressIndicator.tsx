interface ProgressIndicatorProps {
  current: number;
  max: number;
}

export function ProgressIndicator({ current, max }: ProgressIndicatorProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-neutral-200 z-50">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-600">Your Reflections</span>
          <span className="text-neutral-900">{current}/{max}</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all duration-500 ease-out"
            style={{ width: `${(current / max) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
