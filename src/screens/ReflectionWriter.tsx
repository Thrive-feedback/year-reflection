import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface ReflectionWriterProps {
  topic: string;
  initialText: string;
  initialRating: number
  onComplete: (text: string, rating: number) => void;
  onBack: () => void;
}

const MAX_CHARACTERS = 180;

const PLACEHOLDERS = [
  "Share your thoughts...",
  "What comes to mind?",
  "Take a moment to reflect...",
  "Your story matters...",
  "Write from the heart...",
];

export function ReflectionWriter({
  topic,
  initialText,
  initialRating,
  onComplete,
  onBack,
}: ReflectionWriterProps) {
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  
  const remainingChars = MAX_CHARACTERS - text.length;
  const placeholder =
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (text.trim()) {
  //     // onComplete(text.trim());
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && text.trim()) {
      onComplete(text.trim(), rating);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-8">
        {/* Topic Display */}
        <div className="space-y-2">
          <div className="text-neutral-500">Reflecting on</div>
          <h1 className="text-neutral-900">{topic}</h1>
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-6 bg-white border border-neutral-200 rounded-lg resize-none focus:outline-none focus:border-neutral-400 transition-colors text-neutral-900 placeholder:text-neutral-400"
            autoFocus
          />

          {/* Character Counter */}
          <div className="flex justify-between items-center text-neutral-500">
            <div>
              {text.length === 0 && "Start writing your reflection"}
              {text.length > 0 && text.length < 30 && "Keep going..."}
              {text.length >= 30 &&
                text.length < MAX_CHARACTERS - 20 &&
                "Looking good!"}
              {text.length >= MAX_CHARACTERS - 20 &&
                remainingChars > 0 &&
                `${remainingChars} characters left`}
              {remainingChars === 0 && "Maximum length reached"}
            </div>
            <div className={remainingChars < 20 ? "text-neutral-900" : ""}>
              {text.length}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Rating Question */}
        <div className="text-center space-y-8">
          {/* Rating Display */}
          <div className="py-8">
            <div className="text-neutral-900 text-7xl">
              {displayRating > 0 ? displayRating : "–"}
            </div>
            <div className="text-neutral-400 mt-2">out of 10</div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoveredRating(num)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  num === rating
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : num === hoveredRating
                    ? "bg-neutral-100 border-neutral-400"
                    : "bg-white border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={rating === 0 || text.trim().length === 0}
          className="w-full bg-neutral-900 text-white rounded-lg py-4 px-6 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          Select next topic
        </button>
      </form>
    </div>
  );
}
